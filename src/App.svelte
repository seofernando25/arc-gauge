<script lang="ts">
    import ArcGauge, {
        type ArcDescription,
    } from "./lib/ArcGauge/ArcGauge.svelte";
    import "98.css";

    function createArcs(n: number): ArcDescription[] {
        return Array.from({ length: n }, (_, i) => ({
            start: i / n,
            end: (i + 1) / n,
            color: `hsl(${(i * 360) / n}, 100%, 50%)`,
        }));
    }

    let cursorPosition = $state(0.25);
    let is_loading = $state(false);
    let stroke_width = $state(0.25);
    let arcs = $state<ArcDescription[]>(createArcs(4));

    function randomizeArc() {
        const narcs = Math.floor(Math.random() * 5) + 2;
        const points = Array.from({ length: narcs }, () => Math.random());
        points.sort((a, b) => a - b);
        arcs = points.map((p, i) => ({
            start: p,
            end: points[i + 1] || 1,
            color: `hsl(${(i * 360) / narcs}, 100%, 50%)`,
        }));
        arcs[0].start = 0;
        arcs[arcs.length - 1].end = 1;
    }
</script>

<main>
    <div class="window" style="width: 300px">
        <div class="title-bar">
            <div class="title-bar-text">Gauge</div>
        </div>
        <div class="window-body">
            <ArcGauge
                bind:is_loading
                bind:cursorPosition
                bind:stroke_width
                bind:arcs
            ></ArcGauge>
        </div>
    </div>

    <div class="field-row">
        <label for="value-control">Value:</label>
        <input
            id="value-control"
            type="range"
            min="0"
            max="1"
            step={0.01}
            bind:value={cursorPosition}
        />
        <span>{cursorPosition.toFixed(2)}</span>
    </div>

    <div class="field-row">
        <label for="stroke-control">Stroke Width:</label>
        <input
            id="stroke-control"
            type="range"
            min="0"
            max="0.4"
            step={0.01}
            bind:value={stroke_width}
        />
        <span>{stroke_width.toFixed(2)}</span>
    </div>

    <!-- toggle is loading -->
    <button onclick={() => (is_loading = !is_loading)}>
        {is_loading ? "Stop Loading" : "Start Loading"}
    </button>

    <!-- random stroke width -->
    <button onclick={randomizeArc}> Random Arc </button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
