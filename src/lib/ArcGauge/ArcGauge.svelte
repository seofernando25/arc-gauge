<script context="module" lang="ts">
    export type ArcDescription = {
        start: number;
        end: number;
        color?: string;
    };
</script>

<script lang="ts">
    import "$lib/tc.css";
    import {
        stagger,
        timeline,
        type AnimationControls,
        type TimelineDefinition,
    } from "motion";
    import { tweened } from "svelte/motion";

    const LOADING_COLOR = "#666666";

    export let is_loading = false;

    export let arcs: ArcDescription[] = [];
    const arc_refs: SVGCircleElement[] = [];

    // QUICK REMINDER:
    // The dollar sign variables are computed based on the stroke_width
    // In Angular, this would be equivalent to the computed signal (but you could also use RxJS)

    export let cursorPosition = 0.25;
    // Separate displayed tweened value
    let cursorValue = tweened(cursorPosition);
    $: cursorValue.set(cursorPosition);
    $: current_arc = arcs.find(
        (arc) => arc.start <= $cursorValue && arc.end >= $cursorValue
    );
    // X and Y coordinates of the cursor
    $: cursor_x = -2 * Math.cos($cursorValue * Math.PI);
    $: cursor_y = 1 - 2 * Math.sin($cursorValue * Math.PI);

    export let stroke_width = 1;
    $: padding_size = stroke_width / 10;
    $: pad = 1.25 * stroke_width;
    $: radius = 2;
    $: circumference = radius * Math.PI * 2;

    // region Loading Animation
    const sequence: TimelineDefinition = [
        [arc_refs, { opacity: 0.6 }, { duration: 0.3, delay: stagger(0.1) }],
        [arc_refs, { opacity: 1 }, { duration: 0.3, delay: stagger(0.1) }],
    ];

    let loading_anim: AnimationControls | undefined;
    $: {
        if (is_loading) {
            if (loading_anim) {
                loading_anim.finish();
            }
            loading_anim = timeline(sequence, {
                repeat: Infinity,
                delay: 0.5,
            });
        } else {
            if (loading_anim) {
                loading_anim.cancel();
                loading_anim = undefined;
            }
        }
    }
    // endregion
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
                bind:this={arc_refs[index]}
                cx={0}
                cy={1}
                r={radius}
                stroke={is_loading ? LOADING_COLOR : arc?.color}
                transform="rotate({180 + padStart * 180})"
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
