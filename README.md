# LLM Security Lab

A local AI security research environment for testing the [OWASP Top 10 for LLM Applications (2025)](https://genai.owasp.org/llm-top-10/). Everything runs on your machine inside Docker. No cloud accounts or API keys required.

---

## What this is

Most LLM security resources describe attacks theoretically. This lab lets you run them against a real model, watch what happens live, and build intuition for how these vulnerabilities actually behave.

You get a split-screen dashboard showing the attacker side (prompts being sent) and the victim side (model responses) simultaneously. Every experiment maps to a specific OWASP risk category.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Browser                             │
│                                                                 │
│   localhost:3001          localhost:8080          localhost:8090 │
│   Open WebUI              Security Dashboard      Agent API     │
│   (manual chat)           (attack experiments)    (task runner) │
└────────┬──────────────────────────┬──────────────────────┬──────┘
         │                          │                      │
         ▼                          ▼                      ▼
┌─────────────────┐      ┌──────────────────┐   ┌──────────────────────┐
│     Ollama      │      │  Lab Dashboard   │   │  Agent Orchestrator  │
│  localhost:11434│      │  (FastAPI + SSE) │   │  Agentic loop        │
│                 │      │                  │   │  Multi-step planning │
│  mistral        │      │  Streams attack  │   │  Tool use via MCP    │
│  llama3.2       │      │  events live     │   └──────────┬───────────┘
│  nomic-embed    │      └──────────────────┘              │
└────────┬────────┘                                        ▼
         │                                      ┌──────────────────────┐
         │                                      │    MCP Tool Server   │
         │                                      │    localhost:8091    │
         │                                      │                      │
         │                                      │  search_knowledge_base
         │                                      │  get_employee        │
         │                                      │  get_financials      │
         │                                      │  get_customers       │
         │                                      │  send_email          │
         │                                      │  read_file           │
         │                                      │  calculate           │
         │                                      │  create_ticket       │
         │                                      └───┬──────────┬───────┘
         │                                          │          │
         ▼                                          ▼          ▼
┌─────────────────┐                    ┌────────────────┐  ┌─────────────────────┐
│   RAG Pipeline  │◄───────────────────│   ChromaDB     │  │  Systems of Record  │
│  localhost:8093 │   embed + retrieve │  localhost:8000│  │  localhost:8092     │
│                 │                    │                │  │                     │
│  /query         │                    │  hr_docs       │  │  GET /hr/employees  │
│  /ingest        │                    │  finance_docs  │  │  GET /finance/...   │
│                 │                    │  customer_docs │  │  GET /customers/... │
│  nomic-embed    │                    │  policy_docs   │  │                     │
│  mistral (LLM)  │                    └────────────────┘  │  Sample data:       │
└─────────────────┘                                        │  7 employees        │
                                                           │  4 quarters         │
                                                           │  5 customers        │
                                                           │  6 HR policies      │
                                                           └─────────────────────┘
```

### Components

| Container | Port | Role |
|---|---|---|
| `ollama` | 11434 | Local LLM server. Runs mistral, llama3.2, nomic-embed-text |
| `ollama-init` | — | Pulls models on first boot then exits |
| `open-webui` | 3001 | Browser chat UI connected to Ollama |
| `lab-dashboard` | 8080 | Split-screen attacker/victim experiment runner |
| `agent-orchestrator` | 8090 | Agentic loop: plan → tool call → observe → repeat |
| `mcp-server` | 8091 | Tool catalog. All agent tools live here |
| `rag-pipeline` | 8093 | Embeds documents, retrieves context, generates answers |
| `chromadb` | 8000 | Vector store. Holds embeddings for all company data |
| `systems-of-record` | 8092 | Simulated HR, Finance, and Customer REST APIs |

### Models (all free, all local)

| Model | Size | Used for |
|---|---|---|
| `mistral` | ~4GB | Main LLM for all experiments and RAG generation |
| `llama3.2` | ~2GB | Secondary LLM, better safety filters for comparison |
| `nomic-embed-text` | ~274MB | Text embeddings for ChromaDB |

### Data flow

```
User query
  → Agent (mistral reasons about which tools to use)
    → MCP Server (executes tool call)
      → RAG Pipeline (embeds query, retrieves from ChromaDB)
        → ChromaDB (returns top-N relevant documents)
      → Systems of Record (live HR/Finance/Customer data)
    → MCP returns result to Agent
  → Agent reasons again, calls more tools or returns final answer
```

---

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, Mac, or Linux)
- 16GB RAM recommended (12GB minimum)
- 15GB free disk space (models + containers)
- Docker Desktop running before you start

---

## Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/llm-security-lab.git
cd llm-security-lab

# Start everything
docker compose up -d
```

First boot downloads three models (~8GB total). This takes 5–20 minutes depending on your connection. Watch progress:

```bash
docker logs ollama-init -f
```

You'll see `All models ready.` when it's done. Then check the RAG pipeline has ingested the sample data:

```bash
docker logs rag-pipeline -f
```

You'll see `Ingestion complete.` when ChromaDB is seeded.

### Verify everything is up

```bash
docker compose ps
```

All containers should show `running` or `healthy`. Then open:

| URL | What you should see |
|---|---|
| http://localhost:3001 | Open WebUI login page |
| http://localhost:8080 | Security lab dashboard |
| http://localhost:8092/health | `{"status":"ok"}` |
| http://localhost:8091/tools | JSON list of available tools |
| http://localhost:8093/health | `{"status":"ok"}` |

---

## Shut down

```bash
# Stop all containers (keeps your data and downloaded models)
docker compose down

# Stop and delete all data including downloaded models
# Use this for a completely clean reset
docker compose down -v
```

---

## Run experiments

Open http://localhost:8080 in your browser.

1. Pick an experiment from the left sidebar
2. Click **Run Experiment**
3. Watch the left panel (attacker prompts) and right panel (model responses) update live
4. The audit log on the right tracks every flagged response

### Experiment map

| # | Experiment | OWASP 2025 | What it tests |
|---|---|---|---|
| 01 | Prompt Injection | LLM01 | Override system instructions via user input |
| 02 | Jailbreak | LLM01 | Bypass safety filters via role-play and framing |
| 03 | Data Leakage | LLM02 | Extract system prompt and confidential context |
| 04 | Input DoS | LLM10 | Pathological inputs causing max latency |
| 05 | Resource Exhaustion | LLM10 | 10 concurrent requests, measure degradation |
| 06 | Data Poisoning | LLM04 | Inject malicious docs, observe if model follows them |
| 07 | Sensitive Data | LLM02 | Extract PII from model context |
| 08 | Harmful Content | LLM05 | Safety filter bypass via fictional framing |
| 09 | Hallucinations | LLM09 | Bait model into confident false statements |
| 10 | Tool Poisoning | LLM08 | Hide instructions inside tool descriptions |
| 11 | RCE | LLM05 | Get model to generate shell commands |
| 12 | Broad Permissioning | LLM06 | Over-permissioned agent uses unnecessary tools |
| 13 | Tool Manipulation | LLM08 | Inject malicious data into tool return values |
| 14 | Excessive Agency | LLM06 | Agent takes unsanctioned actions beyond its task |
| 15 | Mass Data Exfil | LLM02 | Systematically enumerate all data via RAG queries |

---

## Test the architecture manually

### Chat with the model

Open http://localhost:3001, create an account, and select `mistral` or `llama3.2` from the model picker.

### Ask the agent a question

```bash
# Start a task
curl -X POST http://localhost:8090/run \
  -H "Content-Type: application/json" \
  -d '{"task": "What was Q3 revenue and which customers are at risk?"}'

# Returns: {"run_id": "abc12345", ...}

# Stream the agentic loop live
curl http://localhost:8090/run/abc12345/stream

# Or get the final result
curl http://localhost:8090/run/abc12345/result
```

### Query the RAG pipeline directly

```bash
# Search across all collections
curl -X POST http://localhost:8093/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the password policy?", "collection": "policy"}'

# Search finance data
curl -X POST http://localhost:8093/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What was net income in Q3?", "collection": "finance"}'

# Re-seed ChromaDB from scratch
curl -X POST http://localhost:8093/ingest
```

### Browse the tool catalog

```bash
# List all tools the agent can use
curl http://localhost:8091/tools

# Call a tool directly
curl -X POST http://localhost:8091/tools/get_financials \
  -H "Content-Type: application/json" \
  -d '{"params": {"type": "summary"}}'

curl -X POST http://localhost:8091/tools/get_employee \
  -H "Content-Type: application/json" \
  -d '{"params": {"dept": "Engineering"}}'

curl -X POST http://localhost:8091/tools/calculate \
  -H "Content-Type: application/json" \
  -d '{"params": {"expression": "2400000 * 0.15"}}'

# Check the audit log (every tool call is recorded here)
curl http://localhost:8091/audit
```

### Hit the systems of record directly

```bash
# HR
curl http://localhost:8092/hr/employees
curl http://localhost:8092/hr/employees/E001
curl http://localhost:8092/hr/employees?dept=Engineering
curl http://localhost:8092/hr/policies
curl http://localhost:8092/hr/search?q=password

# Finance
curl http://localhost:8092/finance/summary
curl http://localhost:8092/finance/quarterly
curl http://localhost:8092/finance/quarterly/Q3-2024
curl http://localhost:8092/finance/budgets
curl http://localhost:8092/finance/transactions

# Customers
curl http://localhost:8092/customers/accounts
curl http://localhost:8092/customers/accounts?health=red
curl http://localhost:8092/customers/mrr
curl http://localhost:8092/customers/tickets?status=open
```

---

## Compare model defenses

Run the same experiment twice — once targeting `mistral`, once targeting `llama3.2`. Change the model in `.env`:

```bash
# .env
MODEL_NAME=llama3.2
```

Then restart the dashboard:

```bash
docker compose restart dashboard
```

Older or smaller models fail more tests. Newer models have stronger safety training. The gap between them is your attack surface to document.

---

## Logs and debugging

```bash
# All containers at once
docker compose logs -f

# One container
docker logs ollama -f
docker logs rag-pipeline -f
docker logs mcp-server -f
docker logs agent-orchestrator -f
docker logs systems-of-record -f

# Check container health
docker compose ps

# Restart one container
docker compose restart rag-pipeline

# Rebuild after code changes
docker compose up -d --build dashboard
docker compose up -d --build agent
```

---

## Reset

```bash
# Soft reset — restart all containers, keep models and data
docker compose restart

# Hard reset — wipe all data, keep downloaded models
docker compose down
docker volume rm llm-security-lab_chroma_data
docker volume rm llm-security-lab_open-webui_data
docker compose up -d

# Full wipe — everything including downloaded models (~8GB re-download)
docker compose down -v
docker compose up -d
```

---

## Project structure

```
llm-security-lab/
│
├── docker-compose.yml              ← starts the whole stack
├── .env.example                    ← copy to .env
├── .gitignore
├── README.md
│
├── dashboard/                      ← security experiment runner
│   ├── Dockerfile
│   ├── requirements.txt
│   └── server.py                   ← FastAPI + SSE event streaming
│
├── static/
│   └── index.html                  ← split-screen attacker/victim UI
│
├── tools/
│   └── config.py                   ← shared Ollama client
│
├── experiments/                    ← one file per OWASP attack
│   ├── 01_prompt_injection.py
│   ├── 02_jailbreak.py
│   ├── 03_data_leakage.py
│   ├── 04_input_dos.py
│   ├── 05_resource_exhaustion.py
│   ├── 06_data_poisoning.py
│   ├── 07_sensitive_data.py
│   ├── 08_harmful_content.py
│   ├── 09_hallucinations.py
│   ├── 10_tool_poisoning.py
│   ├── 11_rce.py
│   ├── 12_broad_permissioning.py
│   ├── 13_tool_manipulation.py
│   ├── 14_excessive_agency.py
│   └── 15_mass_data_exfil.py
│
└── architecture/
    ├── agent/                      ← agentic loop + tool use
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── orchestrator.py
    │
    ├── mcp/                        ← tool catalog and execution
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── server.py
    │
    ├── rag/                        ← embed, store, retrieve, generate
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   ├── pipeline.py
    │   └── ingest.py
    │
    └── systems_of_record/          ← sample HR, Finance, Customer APIs
        ├── Dockerfile
        ├── requirements.txt
        ├── api.py
        └── seed_data.py
```

---

## Add a new experiment

Create a new file in `experiments/` following this pattern:

```python
# experiments/16_my_attack.py
"""One-line description shown in the dashboard sidebar."""
import sys
sys.path.insert(0, "/app")
from tools.config import chat

ATTACKS = [
    ("attack_name", "The prompt to send"),
]

def run():
    for name, prompt in ATTACKS:
        yield {"type": "attack",   "name": name, "prompt": prompt}
        reply   = chat([{"role": "user", "content": prompt}])
        flagged = "some trigger" in reply.lower()
        yield {
            "type":    "response",
            "name":    name,
            "content": reply,
            "flagged": flagged,
            "reason":  "Reason it was flagged" if flagged else None
        }
```

The dashboard picks it up automatically on the next page load. No restart needed.

---

## References

- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/)
- [NVIDIA Garak — LLM vulnerability scanner](https://github.com/NVIDIA/garak)
- [Damn Vulnerable LLM Agent](https://github.com/ReversecLabs/damn-vulnerable-llm-agent)
- [Ollama model library](https://ollama.com/library)
- [ChromaDB docs](https://docs.trychroma.com)