<script module lang="ts">
    export type ArcDescription = {
        start: number;
        end: number;
        color?: string;
    };
</script>

<script lang="ts">
    import "$lib/tc.css";

    const LOADING_COLOR = "#666666";

    let {
        is_loading = $bindable(false),
        arcs = $bindable<ArcDescription[]>([]),
        cursorPosition = $bindable(0.25),
        stroke_width = $bindable(1),
    } = $props();

    let current_arc = $derived(
        arcs.find((arc) => arc.start <= cursorPosition && arc.end >= cursorPosition)
    );
    let cursor_x = $derived(-2 * Math.cos(cursorPosition * Math.PI));
    let cursor_y = $derived(1 - 2 * Math.sin(cursorPosition * Math.PI));

    let padding_size = $derived(stroke_width / 10);
    let pad = $derived(1.25 * stroke_width);
    let radius = 2;
    let circumference = $derived(radius * Math.PI * 2);
</script>

<div class="arc-wrapper">
    <svg
        width="100%"
        height="100%"
        viewBox={`-${1 + pad} -${1 + pad} ${2 + 2 * pad} ${2 + 2 * pad}`}
        stroke-width={stroke_width}
        stroke-linecap="round"
        fill="none"
        stroke-dasharray={circumference}
    >
        {#each arcs as arc, index}
            {@const start = arc.start}
            {@const end = arc.end}
            {@const padStart = index === 0 ? start : start + padding_size}
            {@const padEnd =
                index === arcs.length - 1 ? end : end - padding_size}

            <circle
                class:loading-arc={is_loading}
                style={`--arc-delay: ${index * 0.1}s`}
                cx={0}
                cy={1}
                r={radius}
                stroke={is_loading ? LOADING_COLOR : arc?.color}
                transform={`rotate(${180 + padStart * 180})`}
                transform-origin={`${0} ${1}`}
                stroke-dashoffset={circumference -
                    ((padEnd - padStart) / 2) * circumference}
            ></circle>
        {/each}

        <!-- Main Cursor -->
        {#if !is_loading}
            <circle
                fill="white"
                cx={cursor_x}
                cy={cursor_y}
                r={stroke_width}
                stroke={current_arc ? current_arc.color : "black"}
                stroke-width={stroke_width / 2}
            ></circle>
        {/if}

        {#if is_loading}
            {@const line_height = 1 - stroke_width}
            {@const line_width = stroke_width * 4}
            {@const line_spacing = stroke_width * 1.5}

            <line
                x1={-line_width - line_spacing / 2}
                y1={line_height}
                x2={-line_spacing / 2}
                y2={line_height}
                stroke={LOADING_COLOR}
                stroke-width={stroke_width}
                class="opacity-shimmer"
            ></line>

            <line
                x1={+line_spacing / 2}
                y1={line_height}
                x2={+line_spacing / 2 + line_width}
                y2={line_height}
                stroke={LOADING_COLOR}
                stroke-width={stroke_width}
                class="opacity-shimmer delay-1"
            ></line>
        {:else}
            <!-- LOGO or Text -->
        {/if}
    </svg>
</div>

<style lang="scss">
    .arc-wrapper {
        aspect-ratio: 2 / 1;
        display: flex;
    }

    .opacity-shimmer {
        opacity: 0.6;
        animation: OpacityShimmer 1s infinite;
    }

    .loading-arc {
        opacity: 0.6;
        animation: OpacityShimmer 0.6s infinite both;
        animation-delay: var(--arc-delay, 0s);
    }

    .delay-1 {
        animation-delay: 0.3s;
    }

    @keyframes OpacityShimmer {
        0% {
            opacity: 0.75;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            opacity: 0.75;
        }
    }
</style>
