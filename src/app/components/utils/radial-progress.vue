<!-- LICENSE https://github.com/wyzantinc/vue-radial-progress/blob/master/LICENSE -->

<template>
  <div class="radial-progress-container" :style="containerStyle">
    <div class="radial-progress-inner" :style="innerCircleStyle">
      <slot></slot>
    </div>
    <svg
      class="radial-progress-bar"
      :width="diameter"
      :height="diameter"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient
          :id="'radial-gradient' + _uid"
          :fx="gradient.fx"
          :fy="gradient.fy"
          :cx="gradient.cx"
          :cy="gradient.cy"
          :r="gradient.r">
          <stop
            offset="100%"
            class="radial-progress-bar__radial-gradient__stop"
            :class="`radial-progress-bar__radial-gradient__stop--${color}`"
          />
        </radialGradient>
      </defs>
      <circle
        :style="strokeStyle"
        :r="innerCircleRadius"
        :cx="radius"
        :cy="radius"
        fill="transparent"
        :stroke="innerStrokeColor"
        :stroke-dasharray="circumference"
        stroke-dashoffset="0"
        :stroke-linecap="strokeLinecap"
      ></circle>
      <circle
        :transform="'rotate(270, ' + radius + ',' + radius + ')'"
        :r="innerCircleRadius"
        :cx="radius"
        :cy="radius"
        fill="transparent"
        :stroke="'url(#radial-gradient' + _uid + ')'"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference"
        :stroke-linecap="strokeLinecap"
        :style="progressStyle"></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RadialProgress',
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 60,
    },
    max: {
      type: Number,
      required: true,
      default: 10,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    strokeWidth: {
      type: Number,
      required: false,
      default: 5,
    },
    innerStrokeWidth: {
      type: Number,
      required: false,
      default: 5,
    },
    strokeLinecap: {
      type: String,
      required: false,
      default: 'round',
    },
    animateSpeed: {
      type: Number,
      required: false,
      default: 1000,
    },
    innerStrokeColor: {
      type: String,
      required: false,
      default: 'secondary',
    },
    fps: {
      type: Number,
      required: false,
      default: 60,
    },
    timingFunc: {
      type: String,
      required: false,
      default: 'linear',
    },
    isClockwise: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      gradient: {
        fx: 0.99,
        fy: 0.5,
        cx: 0.5,
        cy: 0.5,
        r: 0.65,
      },
      gradientAnimation: null,
      currentAngle: 0,
      strokeDashoffset: 0,
    };
  },
  computed: {
    radius() {
      return this.diameter / 2;
    },
    circumference() {
      return Math.PI * this.innerCircleDiameter;
    },
    stepSize() {
      if (this.max === 0) {
        return 0;
      }
      return 100 / this.max;
    },
    finishedPercentage() {
      return this.stepSize * this.value;
    },
    circleSlice() {
      return (2 * Math.PI) / this.max;
    },
    animateSlice() {
      return this.circleSlice / this.totalPoints;
    },
    innerCircleDiameter() {
      return this.diameter - (this.innerStrokeWidth * 2);
    },
    innerCircleRadius() {
      return this.innerCircleDiameter / 2;
    },
    totalPoints() {
      return this.animateSpeed / this.animationIncrements;
    },
    animationIncrements() {
      return 1000 / this.fps;
    },
    containerStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
      };
    },
    progressStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.strokeWidth}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: `stroke-dashoffset ${this.animateSpeed}ms ${this.timingFunc}`,
      };
    },
    strokeStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.innerStrokeWidth}px`,
        stroke: 'var(--secondary-color)',
      };
    },
    innerCircleStyle() {
      return {
        width: `${this.innerCircleDiameter}px`,
      };
    },
  },
  watch: {
    max() {
      this.changeProgress({ isAnimate: true });
    },
    value() {
      this.changeProgress({ isAnimate: true });
    },
    diameter() {
      this.changeProgress({ isAnimate: true });
    },
    strokeWidth() {
      this.changeProgress({ isAnimate: true });
    },
  },
  created() {
    this.changeProgress({ isAnimate: false });
  },
  methods: {
    getStopPointsOfCircle(steps) {
      const points = [];
      for (let i = 0; i < steps; i += 1) {
        const angle = this.circleSlice * i;
        points.push(this.getPointOfCircle(angle));
      }
      return points;
    },
    getPointOfCircle(angle) {
      const radius = 0.5;
      const x = radius + (radius * Math.cos(angle));
      const y = radius + (radius * Math.sin(angle));
      return { x, y };
    },
    gotoPoint() {
      const point = this.getPointOfCircle(this.currentAngle);
      if (point.x && point.y) {
        this.gradient.fx = point.x;
        this.gradient.fy = point.y;
      }
    },
    direction() {
      if (this.isClockwise) {
        return 1;
      }
      return -1;
    },
    changeProgress({ isAnimate = true }) {
      this.strokeDashoffset = ((100 - this.finishedPercentage) / 100) * this.circumference * this.direction();
      if (this.gradientAnimation) {
        clearInterval(this.gradientAnimation);
      }
      if (!isAnimate) {
        this.gotoNextStep();
        return;
      }
      const angleOffset = (this.value - 1) * this.circleSlice;
      let i = (this.currentAngle - angleOffset) / this.animateSlice;
      const incrementer = Math.abs(i - this.totalPoints) / this.totalPoints;
      const isMoveForward = i < this.totalPoints;
      this.gradientAnimation = setInterval(() => {
        if ((isMoveForward && i >= this.totalPoints)
          || (!isMoveForward && i < this.totalPoints)) {
          clearInterval(this.gradientAnimation);
          return;
        }
        this.currentAngle = angleOffset + (this.animateSlice * i);
        this.gotoPoint();
        i += isMoveForward ? incrementer : -incrementer;
      }, this.animationIncrements);
    },
    gotoNextStep() {
      this.currentAngle = this.value * this.circleSlice;
      this.gotoPoint();
    },
  },
};
</script>

<style lang="scss" scoped>
.radial-progress-container {
  position: relative;
}

.radial-progress-inner {
  @extend %typo-subtitle-2;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.radial-progress-bar__radial-gradient__stop {
  &--primary {
    stop-color: var(--primary-color);
  }
  &--success {
    stop-color: var(--success-color);
  }
  &--danger {
    stop-color: var(--error-color);
  }
}
</style>
