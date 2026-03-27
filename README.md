# POgo — S1 Policy Override Generator

A browser-based tool for building SentinelOne agent Policy Override (PO) JSON. Select from a library of validated templates across Windows, Linux, and macOS, or paste custom JSON blocks — the tool deep-merges everything into a single ready-to-deploy output.

---

## How it works

1. **Select your platform** — choose Windows, Linux, or macOS using the tabs at the top.
2. **Add override blocks** — use the left panel to pick a template (grouped by category) or paste your own JSON directly into the editor.
3. **Label the block** (optional) — give it a name, or leave it blank and the top-level key(s) will be used automatically.
4. **Click "+ Add Block"** — the block appears in the right panel and the merged JSON output updates instantly below it.
5. **Export** — copy to clipboard or download the final JSON file, ready to apply as a Policy Override in the SentinelOne console.

Each block is deep-merged in order, so later blocks override earlier ones on any conflicting keys.

---

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node)

### Setup

```bash
git clone https://github.com/mickbrowns1/PO-Generator.git
cd PO-Generator
npm install
npm run dev
```

The app will be available at **http://localhost:3000**.

### Other npm commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the production bundle |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run the Next.js linter |

---

## Running with Docker

Docker is the recommended way to deploy or share the tool without needing Node installed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac/Windows) or Docker Engine + Docker Compose (Linux)

### Quick start

```bash
git clone https://github.com/mickbrowns1/PO-Generator.git
cd PO-Generator
docker compose up --build
```

The app will be available at **http://localhost:3000**.

To stop it:

```bash
docker compose down
```

### Running in the background

```bash
docker compose up --build -d
```

Check it's running:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Stop it:

```bash
docker compose down
```

### Using plain Docker (no Compose)

Build the image:

```bash
docker build -t po-generator .
```

Run it:

```bash
docker run -p 3000:3000 po-generator
```

Run in the background:

```bash
docker run -d -p 3000:3000 --name po-generator --restart unless-stopped po-generator
```

Stop and remove the container:

```bash
docker stop po-generator && docker rm po-generator
```

### Changing the port

To run on a different host port (e.g. 8080), edit `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"
```

Or pass it directly with `docker run`:

```bash
docker run -p 8080:3000 po-generator
```

Then open **http://localhost:8080**.

### How the Docker build works

The Dockerfile uses a three-stage build to keep the final image small:

1. **deps** — installs npm dependencies via `npm ci`
2. **builder** — runs `next build` to produce a standalone output bundle
3. **runner** — copies only the built output into a minimal Alpine image, runs as a non-root user

The resulting image contains no source code, no `node_modules`, and no dev tooling.

---

## Supported platforms & templates

| Platform | Categories |
|---|---|
| **Windows** | Special Images, Deep Visibility, Behavioral Logic, Indicators & Detectors, Exclusions, Credential Protection, Exploit Prevention, Deep Hooking, Detection Extensions, Scanning, Agent UI, Injection, Named Pipes, Disk & Diagnostics, Communication |
| **Linux** | Anti-Tamper, Brute Force, Communication, Containers, Deep Visibility, eBPF, Engines, Events, File Monitoring, Firewall, Forensics & Diagnostics, Indicators & Detectors, Mitigation, Network, Ransomware, Remote Operations, Resource Limits, Security, Telemetry |
| **macOS** | Agent UI, Communication, Deep Visibility, Detection, Device Control, Firewall, Forensics, General, Indicators & Detectors, Network, Remediation, Remote Operations, Scanner |

---

## Importing an existing config

Use the **Import** button in the top-right to paste an existing Policy Override JSON. The tool will load it as the base config for the current platform. You can then add further override blocks on top.

Use **Reset** to return to the default config for the selected platform.
