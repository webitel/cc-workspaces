<template>
       <div class="loader">
        <svg viewBox="0 0 80 80">
            <rect x="8" y="8" width="64" height="64"></rect>
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'loader',
    };
</script>

<style lang="scss" scoped>
    // https://codepen.io/aaroniker/pen/omvYNZ
    $path: #171A2A;
    $dot: #F3BA00;
    $duration: 3s;

    .loader {
        position: relative;
        width: 44px;
        height: 44px;
        margin: auto;

        &:before {
            content: '';
            width: calcRem(6px);
            height: calcRem(6px);
            border-radius: 50%;
            position: absolute;
            display: block;
            background: $dot;
            top: 37px;
            left: 19px;
            transform: translate(-18px, -18px);
            animation: dotRect $duration linear infinite;
        }

        svg {
            display: block;
            width: 100%;
            height: 100%;

            rect {
                fill: none;
                stroke: $path;
                stroke-width: 10px;
                stroke-linejoin: round;
                stroke-linecap: round;
                stroke-dasharray: (256 / 4 * 3) (256 / 4) (256 / 4 * 3) (256 / 4);
                stroke-dashoffset: 0;
                animation: pathRect 3s linear infinite;
            }
        }
    }

    @keyframes pathRect {
        25% {
            stroke-dashoffset: 64;
        }
        50% {
            stroke-dashoffset: 128;
        }
        75% {
            stroke-dashoffset: 192;
        }
        100% {
            stroke-dashoffset: 256;
        }
    }

    @keyframes dotRect {
        25% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(18px, -18px);
        }
        75% {
            transform: translate(0, -36px);
        }
        100% {
            transform: translate(-18px, -18px);
        }
    }
</style>
