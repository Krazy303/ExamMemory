import { createServerFn } from "@tanstack/react-start";

const COGNEE_API_URL = process.env.COGNEE_API_URL || "https://api.cognee.ai";
const COGNEE_API_KEY = process.env.COGNEE_API_KEY || "";
const COGNEE_TENANT_ID = process.env.COGNEE_TENANT_ID || "";

function getHeaders() {
  const headers: Record<string, string> = {
    "X-Api-Key": COGNEE_API_KEY,
    "Content-Type": "application/json",
  };
  if (COGNEE_TENANT_ID) {
    headers["X-Tenant-Id"] = COGNEE_TENANT_ID;
  }
  return headers;
}

export interface ChatSource {
  name: string;
  excerpt: string;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
  consistency?: {
    type: "same" | "new";
    date?: string;
  };
  isMock?: boolean;
}

// Helper to format or extract responses from Cognee's search output
function formatCogneeResponse(results: any, query: string): ChatResponse {
  // If Cognee returns raw chunks
  if (Array.isArray(results)) {
    if (results.length === 0) {
      return {
        answer: "I couldn't find any relevant information in your notes.",
        sources: [],
      };
    }

    // Try to find if one of the results is a generated completion
    // The search response for GRAPH_COMPLETION / RAG_COMPLETION typically contains the generated text
    // in one of the fields (like `search_result` or as a string).
    // Let's inspect the first item.
    const firstResult = results[0];
    if (typeof firstResult === "string") {
      return {
        answer: results.join("\n"),
        sources: [],
        consistency: { type: "new" },
      };
    }

    if (firstResult && typeof firstResult === "object") {
      const rawResult = firstResult.search_result;
      let resultText = "";

      if (typeof rawResult === "string") {
        resultText = rawResult;
      } else if (Array.isArray(rawResult)) {
        resultText = rawResult.join("\n");
      } else if (rawResult !== undefined && rawResult !== null) {
        resultText = JSON.stringify(rawResult);
      } else {
        resultText = JSON.stringify(firstResult);
      }

      // Extract sources if reference items are available
      const sources: ChatSource[] = [];
      results.forEach((item: any) => {
        if (
          item.dataset_name &&
          item.search_result &&
          item.search_result !== rawResult
        ) {
          const itemText = Array.isArray(item.search_result)
            ? item.search_result.join("\n")
            : typeof item.search_result === "string"
              ? item.search_result
              : JSON.stringify(item.search_result);
          sources.push({
            name: item.dataset_name,
            excerpt: itemText,
          });
        }
      });

      return {
        answer: resultText,
        sources: sources.length > 0 ? sources : undefined,
        consistency: {
          type: Math.random() > 0.5 ? "same" : "new",
          date: "Today",
        },
      };
    }

    return {
      answer: JSON.stringify(results, null, 2),
      sources: [],
    };
  }

  // If it's a single object
  if (results && typeof results === "object") {
    return {
      answer:
        results.search_result || results.answer || JSON.stringify(results),
      sources: results.sources || [],
      consistency: { type: "new" },
    };
  }

  return {
    answer: String(results),
    sources: [],
  };
}

// Server function for searching
export const cogneeSearch = createServerFn({ method: "POST" })
  .validator(
    (d: { query: string; datasetName?: string; searchType?: string }) => d,
  )
  .handler(async ({ data }) => {
    const datasetName = data.datasetName || "default_dataset";
    const searchType = data.searchType || "GRAPH_COMPLETION";

    if (!COGNEE_API_KEY) {
      console.warn("COGNEE_API_KEY is not set. Returning mock search results.");
      return {
        answer: `[Mock Mode] This is a mock response because COGNEE_API_KEY is not set.\n\nTo enable real answers grounded in your notes, please set COGNEE_API_KEY in your .env file.\n\nYour query was: "${data.query}"`,
        sources: [
          {
            name: "mock_setup_guide.md",
            excerpt:
              "To set up Cognee Cloud, create an API key at platform.cognee.ai.",
          },
        ],
        consistency: { type: "new" },
        isMock: true,
      } as ChatResponse;
    }

    try {
      const response = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          query: data.query,
          search_type: searchType,
          datasets: [datasetName],
          include_references: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        if (
          response.status === 404 ||
          errText.includes("Prerequisites not met") ||
          errText.includes("No datasets found") ||
          errText.includes("DatasetNotFoundError")
        ) {
          return {
            answer:
              "Welcome to Memoria! 🚀\n\nYour personal knowledge base is currently empty. To get started, click the **Upload Notes** button at the top right to upload your study files or paste your notes directly. Once uploaded, your material will be indexed and you can ask any questions here!",
            sources: [],
            consistency: { type: "new" },
          };
        }
        throw new Error(`Cognee API error (${response.status}): ${errText}`);
      }

      const results = await response.json();
      return formatCogneeResponse(results, data.query);
    } catch (error: any) {
      console.error("Error in cogneeSearch server function:", error);
      throw error;
    }
  });

// Server function for remember (ingesting text)
export const cogneeRememberText = createServerFn({ method: "POST" })
  .validator(
    (d: { text: string; datasetName?: string; fileName?: string }) => d,
  )
  .handler(async ({ data }) => {
    const datasetName = data.datasetName || "default_dataset";
    const fileName = data.fileName || "note.txt";

    if (!COGNEE_API_KEY) {
      console.warn("COGNEE_API_KEY is not set. Ingesting in mock mode.");
      return { isMock: true, success: true };
    }

    try {
      const formData = new FormData();
      const blob = new Blob([data.text], { type: "text/plain" });
      formData.append("data", blob, fileName);
      formData.append("datasetName", datasetName);
      formData.append("run_in_background", "false");

      const headers: Record<string, string> = {
        "X-Api-Key": COGNEE_API_KEY,
      };
      if (COGNEE_TENANT_ID) {
        headers["X-Tenant-Id"] = COGNEE_TENANT_ID;
      }

      const response = await fetch(`${COGNEE_API_URL}/api/v1/remember`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cognee API error (${response.status}): ${errText}`);
      }

      const resJson = await response.json();
      return { isMock: false, success: true, response: resJson };
    } catch (error: any) {
      console.error("Error in cogneeRememberText server function:", error);
      throw error;
    }
  });

export const cogneeRememberFile = createServerFn({ method: "POST" })
  .validator(
    (d: {
      base64Data: string;
      datasetName?: string;
      fileName?: string;
      mimeType: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const datasetName = data.datasetName || "default_dataset";
    const fileName = data.fileName || "document.pdf";

    if (!COGNEE_API_KEY) {
      console.warn("COGNEE_API_KEY is not set. Ingesting in mock mode.");
      return { isMock: true, success: true };
    }

    try {
      const buffer = Buffer.from(data.base64Data, "base64");
      const blob = new Blob([buffer], { type: data.mimeType });

      const formData = new FormData();
      formData.append("data", blob, fileName);
      formData.append("datasetName", datasetName);
      formData.append("run_in_background", "false");

      const headers: Record<string, string> = {
        "X-Api-Key": COGNEE_API_KEY,
      };
      if (COGNEE_TENANT_ID) {
        headers["X-Tenant-Id"] = COGNEE_TENANT_ID;
      }

      const response = await fetch(`${COGNEE_API_URL}/api/v1/remember`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cognee API error (${response.status}): ${errText}`);
      }

      const resJson = await response.json();
      return { isMock: false, success: true, response: resJson };
    } catch (error: any) {
      console.error("Error in cogneeRememberFile server function:", error);
      throw error;
    }
  });

// Server function for get graph
export const cogneeGetGraph = createServerFn({ method: "GET" })
  .validator((d: { datasetName?: string }) => d)
  .handler(async ({ data }) => {
    const datasetName = data.datasetName || "default_dataset";

    if (!COGNEE_API_KEY) {
      console.warn("COGNEE_API_KEY is not set. Returning mock graph data.");
      return {
        isMock: true,
        nodes: [
          { id: "you", label: "You", type: "student" },
          { id: "cognee", label: "Cognee Cloud AI", type: "subject" },
          { id: "env", label: "Environment variables", type: "chapter" },
          { id: "key", label: "COGNEE_API_KEY", type: "concept" },
        ],
        edges: [
          { source: "you", target: "cognee", label: "uses" },
          { source: "cognee", target: "env", label: "requires" },
          { source: "env", target: "key", label: "contains" },
        ],
      };
    }

    try {
      // 1. Get all datasets to find the datasetId
      const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!listResponse.ok) {
        const errText = await listResponse.text();
        throw new Error(
          `Cognee API error listing datasets (${listResponse.status}): ${errText}`,
        );
      }

      const datasets = await listResponse.json();
      let dataset = datasets.find((d: any) => d.name === datasetName);
      if (!dataset && datasetName !== "default_dataset") {
        dataset = datasets.find((d: any) => d.name === "default_dataset");
      }
      if (!dataset && datasets.length > 0) {
        dataset = datasets[0];
      }

      if (!dataset) {
        return {
          nodes: [
            {
              id: "empty",
              label: "Upload notes to build your mind map!",
              type: "concept",
            },
          ],
          edges: [],
          message: "No datasets found.",
        };
      }

      const datasetId = dataset.id;

      // 2. Fetch the graph
      const graphResponse = await fetch(
        `${COGNEE_API_URL}/api/v1/datasets/${datasetId}/graph`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (!graphResponse.ok) {
        const errText = await graphResponse.text();
        throw new Error(
          `Cognee API error fetching graph (${graphResponse.status}): ${errText}`,
        );
      }

      return await graphResponse.json();
    } catch (error: any) {
      console.error("Error in cogneeGetGraph server function:", error);
      throw error;
    }
  });

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export const cogneeGetDashboardData = createServerFn({ method: "GET" })
  .validator((d: { datasetName?: string }) => d)
  .handler(async ({ data }) => {
    const datasetName =
      data.validator?.datasetName || data.datasetName || "default_dataset";

    if (!COGNEE_API_KEY) {
      return { isMock: true };
    }

    let datasetsCount = 0;
    let dataItemsCount = 0;
    let conceptsMappedCount = 0;
    let searchHistoryCount = 0;
    let searchHistory: any[] = [];
    let syllabusCoverageRes: any[] = [];
    let weakConceptsRes: any[] = [];

    // 1. Fetch Datasets
    try {
      const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (listResponse.ok) {
        const datasets = await listResponse.json();
        datasetsCount = datasets.length;

        let dataset = datasets.find((d: any) => d.name === datasetName);
        if (!dataset && datasets.length > 0) {
          dataset = datasets[0];
        }

        if (dataset) {
          const datasetId = dataset.id;

          // 2. Fetch Data items count
          try {
            const dataResponse = await fetch(
              `${COGNEE_API_URL}/api/v1/datasets/${datasetId}/data`,
              {
                method: "GET",
                headers: getHeaders(),
              },
            );
            if (dataResponse.ok) {
              const items = await dataResponse.json();
              dataItemsCount = Array.isArray(items) ? items.length : 0;
            }
          } catch (e) {
            console.warn("Failed fetching dataset data:", e);
          }

          // 3. Fetch Graph and concepts mapping
          try {
            const graphResponse = await fetch(
              `${COGNEE_API_URL}/api/v1/datasets/${datasetId}/graph`,
              {
                method: "GET",
                headers: getHeaders(),
              },
            );
            if (graphResponse.ok) {
              const graphData = await graphResponse.json();
              conceptsMappedCount =
                graphData && graphData.nodes ? graphData.nodes.length : 0;

              if (graphData && Array.isArray(graphData.nodes)) {
                // filter out document nodes, keep entities
                const entities = graphData.nodes.filter(
                  (n: any) => n.type !== "TextDocument",
                );

                // Build dynamic weak concepts
                weakConceptsRes = entities
                  .slice(0, 4)
                  .map((n: any, idx: number) => ({
                    concept: n.label,
                    subject: "General Study",
                    severity:
                      idx % 3 === 0 ? "high" : idx % 3 === 1 ? "medium" : "low",
                  }));

                // Build dynamic syllabus coverage
                const coveragePct = Math.min(
                  100,
                  Math.max(10, entities.length * 8),
                );
                syllabusCoverageRes = [
                  {
                    subject: "General Study",
                    pct: coveragePct,
                    chapters: entities.slice(0, 4).map((n: any) => ({
                      name: n.label,
                      pct: Math.min(100, 25 + Math.floor(Math.random() * 70)),
                    })),
                  },
                ];
              }
            }
          } catch (e) {
            console.warn("Failed fetching dataset graph:", e);
          }
        }
      }
    } catch (e) {
      console.warn("Failed listing datasets:", e);
    }

    // 4. Fetch Search History
    try {
      const historyResponse = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (historyResponse.ok) {
        searchHistory = await historyResponse.json();
        searchHistoryCount = searchHistory.length;
      }
    } catch (e) {
      console.warn("Failed fetching search history:", e);
    }

    // Format recent activity
    const activities: any[] = [];
    if (Array.isArray(searchHistory)) {
      searchHistory.slice(0, 5).forEach((item: any) => {
        activities.push({
          icon: "message",
          title: `Asked query: "${item.text}"`,
          time: formatTimeAgo(item.createdAt),
          timestamp: new Date(item.createdAt).getTime(),
        });
      });
    }

    // Sort recent activity descending
    activities.sort((a, b) => b.timestamp - a.timestamp);

    const coveragePct = Math.min(100, Math.max(5, conceptsMappedCount * 4));

    return {
      isMock: false,
      stats: [
        {
          label: "Study Streak",
          value: searchHistoryCount > 0 ? "5" : "0",
          suffix: "days",
          icon: "flame",
        },
        {
          label: "Questions Asked",
          value: String(searchHistoryCount),
          suffix: "this week",
          icon: "message",
        },
        {
          label: "Topics Covered",
          value: `${coveragePct}%`,
          suffix: "of syllabus",
          icon: "book",
        },
        {
          label: "Concepts Mapped",
          value: String(conceptsMappedCount),
          suffix: "nodes in graph",
          icon: "alert",
        },
      ],
      recentActivity: activities.slice(0, 5),
      syllabusCoverage:
        syllabusCoverageRes.length > 0 ? syllabusCoverageRes : null,
      weakConcepts: weakConceptsRes.length > 0 ? weakConceptsRes : null,
      conceptsMappedCount,
      dataItemsCount,
    };
  });

export const cogneeGetQuestions = createServerFn({ method: "GET" }).handler(
  async () => {
    if (!COGNEE_API_KEY) {
      return { isMock: true, questions: [] };
    }

    try {
      const historyResponse = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!historyResponse.ok) {
        return { isMock: true, questions: [] };
      }

      const history = await historyResponse.json();
      if (!Array.isArray(history) || history.length === 0) {
        return { isMock: false, questions: [] };
      }

      const mappedQuestions = history.map((item: any, i: number) => ({
        id: item.id || String(i),
        question: item.text,
        answer:
          "Use the 'Memo' tab to query this concept again for a fresh response.",
        subject: "General",
        chapter: "Searches",
        source: "Search History",
        verified: true,
        reused: 1,
      }));

      return { isMock: false, questions: mappedQuestions };
    } catch {
      return { isMock: true, questions: [] };
    }
  },
);

export const cogneeGetMemoSidebarData = createServerFn({
  method: "GET",
}).handler(async () => {
  if (!COGNEE_API_KEY) {
    return { isMock: true };
  }
  try {
    const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
      method: "GET",
      headers: getHeaders(),
    });
    let datasets = [];
    if (listResponse.ok) {
      datasets = await listResponse.json();
    }

    const historyResponse = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
      method: "GET",
      headers: getHeaders(),
    });
    let history = [];
    if (historyResponse.ok) {
      history = await historyResponse.json();
    }

    return {
      isMock: false,
      datasets: datasets.map((d: any) => ({ id: d.id, name: d.name })),
      recentQueries: history.slice(0, 10).map((h: any) => ({
        id: h.id,
        title: h.text,
        updated: formatTimeAgo(h.createdAt),
      })),
    };
  } catch (err) {
    console.error(err);
    return { isMock: true };
  }
});

export const cogneeGetDatasetFiles = createServerFn({ method: "GET" })
  .validator((d: { datasetName?: string }) => d)
  .handler(async ({ data }) => {
    const datasetName = data.datasetName || "default_dataset";
    if (!COGNEE_API_KEY) {
      return { isMock: true, files: [] };
    }
    try {
      const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (!listResponse.ok) return { isMock: false, files: [] };
      const datasets = await listResponse.json();
      const dataset = datasets.find((d: any) => d.name === datasetName);
      if (!dataset) return { isMock: false, files: [] };

      const dataResponse = await fetch(
        `${COGNEE_API_URL}/api/v1/datasets/${dataset.id}/data`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );
      if (!dataResponse.ok) return { isMock: false, files: [] };
      const items = await dataResponse.json();
      return {
        isMock: false,
        files: Array.isArray(items)
          ? items.map((item: any) => ({
              id: item.id || item.name,
              name: item.name || "Unnamed File",
              createdAt: formatTimeAgo(item.createdAt || new Date()),
            }))
          : [],
      };
    } catch (err) {
      console.error(err);
      return { isMock: true, files: [] };
    }
  });

export const cogneeGetTimelineData = createServerFn({ method: "GET" })
  .validator((d: { range?: string }) => d)
  .handler(async ({ data }) => {
    if (!COGNEE_API_KEY) {
      return { isMock: true };
    }
    try {
      const historyResponse = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
        method: "GET",
        headers: getHeaders(),
      });
      let searchHistory = [];
      if (historyResponse.ok) {
        searchHistory = await historyResponse.json();
      }

      const items: any[] = [];

      if (Array.isArray(searchHistory)) {
        searchHistory.forEach((h: any) => {
          let queryText = h.text || "";

          // 1. Filter out internal AI summaries
          if (queryText.startsWith("Summarize this text into")) return;

          // 2. Filter out raw logged search result arrays
          if (queryText.startsWith("[") || queryText.startsWith("[[")) return;

          // 3. Strip out internal prompt styling instructions
          const styleIndex = queryText.indexOf("\n\nStyle instruction:");
          if (styleIndex !== -1) {
            queryText = queryText.slice(0, styleIndex).trim();
          }

          if (!queryText.trim()) return;

          const date = new Date(h.createdAt);
          const todayDate = new Date();
          const yesterdayDate = new Date();
          yesterdayDate.setDate(yesterdayDate.getDate() - 1);

          let dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          if (date.toDateString() === todayDate.toDateString()) {
            dateStr = "Today";
          } else if (date.toDateString() === yesterdayDate.toDateString()) {
            dateStr = "Yesterday";
          }

          items.push({
            date: dateStr,
            rawDate: date,
            title: `Asked query: "${queryText}"`,
            desc: "Queried the knowledge base via Study Workspace.",
            icon: "message",
            subject: "General",
            time: date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            consistency: "new",
          });
        });
      }

      items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

      const groupedMap: Record<string, any[]> = {};
      items.forEach((it) => {
        if (!groupedMap[it.date]) {
          groupedMap[it.date] = [];
        }
        groupedMap[it.date].push(it);
      });

      const groupedList = Object.keys(groupedMap).map((date) => ({
        date,
        items: groupedMap[date],
      }));

      return { isMock: false, timeline: groupedList };
    } catch (err) {
      console.error(err);
      return { isMock: true };
    }
  });

export const cogneeSummarizeText = createServerFn({ method: "POST" })
  .validator((d: { text: string; datasetName?: string }) => d)
  .handler(async ({ data }) => {
    const datasetName =
      data.validator?.datasetName || data.datasetName || "default_dataset";
    if (!COGNEE_API_KEY) {
      return { summary: data.text };
    }
    try {
      const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
        method: "GET",
        headers: getHeaders(),
      });
      let datasetId = "";
      if (listResponse.ok) {
        const datasets = await listResponse.json();
        const dataset =
          datasets.find((d: any) => d.name === datasetName) || datasets[0];
        if (dataset) datasetId = dataset.id;
      }

      const response = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          query: `Summarize this text into one short, concise sentence: "${data.text}"`,
          datasetId: datasetId,
          searchType: "RAG_COMPLETION",
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const formatted = formatCogneeResponse(resData, "summarize");
        let answer = formatted.answer || "";

        const evidenceIndex = answer.search(/(?:Evidence|evidence):/i);
        if (evidenceIndex !== -1) {
          answer = answer.slice(0, evidenceIndex).trim();
        }

        return { summary: answer || data.text };
      }
      return { summary: data.text };
    } catch (err) {
      console.error(err);
      return { summary: data.text };
    }
  });

export const cogneeDeleteDataset = createServerFn({ method: "POST" })
  .validator((d: { datasetName: string }) => d)
  .handler(async ({ data }) => {
    const datasetName = data.validator?.datasetName || data.datasetName;
    if (!COGNEE_API_KEY) {
      return { success: true, isMock: true };
    }
    try {
      const listResponse = await fetch(`${COGNEE_API_URL}/api/v1/datasets`, {
        method: "GET",
        headers: getHeaders(),
      });
      let datasetId = "";
      if (listResponse.ok) {
        const datasets = await listResponse.json();
        const dataset = datasets.find((d: any) => d.name === datasetName);
        if (dataset) datasetId = dataset.id;
      }

      if (!datasetId) {
        throw new Error(`Subject "${datasetName}" not found`);
      }

      const deleteResponse = await fetch(
        `${COGNEE_API_URL}/api/v1/datasets/${datasetId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      if (!deleteResponse.ok) {
        const errText = await deleteResponse.text();
        throw new Error(`Failed to delete subject: ${errText}`);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error deleting dataset:", err);
      throw err;
    }
  });
