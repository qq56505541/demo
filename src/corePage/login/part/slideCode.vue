<template>
  <div ref="slideCodeWrapper" class="slide-code-wrapper">
    <ta-popover
      placement="top-start"
      popper-class="slide-code-popper"
      width="400"
      trigger="click"
      :value="visible"
      :visible-arrow="false"
    >
      <div
        class="side-code-popover-wrapper"
        @mouseenter="handlePopoverMouseEnter"
        @mouseleave="handleSlideCodeReferenceMouseLeave"
      >
        <div class="slide-code-tip" style="background-color: #999999" />
        <div class="slide-code-img-wrapper" style="height: 100%">
          <!--          <div class="slide-code-bg-img" style="background-color: #eee;width: 100%;height: 100%" />-->
          <!--          <div class="slide-code-upper-img" style="width: 60px;height: 60px;background-color: #00acd6" />-->
          <img class="slide-code-bg-img" :src="slideCodeBgImg" alt="背景图">
          <img class="slide-code-upper-img" :style="{left: computedButtonLeft}" :src="slideCodeUpperImg" alt="滑块图">
        </div>
      </div>
      <!--      <span slot="reference">ll</span>-->
      <div
        slot="reference"
        ref="sideCodeContentRef"
        class="slide-code-content"
        @mouseenter="handleSlideCodeReferenceMouseEnter"
        @mouseleave="handleSlideCodeReferenceMouseLeave"
      >
        <transition name="slide-code-bar">
          <div v-if="validate === 'success'" key="success" class="slide-code-validate-success">
            <ta-icon type="check-circle" class="slide-code-validate-success-icon" />
            <span class="slide-code-validate-success-desc">验证成功</span>
          </div>
          <div v-else-if="visible" key="button" class="slide-code-button-wrapper">
            <div class="slide-code-filling" :class="{success: softValidate, error: validate === 'failed', loading: isLoading}" :style="{width: computedFillingDivLeft}" />
            <div
              class="slide-code-button"
              :class="{success: softValidate, error: validate === 'failed'}"
              :style="{left: computedButtonLeft}"
              @mousedown.stop="handleSlideButtonMouseDown"
            >
              <ta-icon v-if="isLoading" type="loading" />
              <ta-icon v-else-if="softValidate" type="check-circle" />
              <ta-icon v-else-if="validate === 'failed'" type="close-circle" />
              <ta-icon v-else type="double-right" />
            </div>
            <span v-if="left === 0 && !isDrag" class="slide-code-operation-desc">请将滑块拖动到正确的位置</span>
            <div v-if="left === 0 && !isDrag" class="slide-code-operation-desc-icon">
              <ta-icon style="margin-left: 5px" type="double-right" />
              <ta-icon style="margin-left: 5px" type="double-right" />
            </div>
          </div>
          <div v-else key="desc" class="slide-code-desc" @click.prevent.stop.self="() => {}">
            <div class="slide-code-desc-icon-wrapper">
              <span class="wave-anim" />
              <span class="wave-anim" />
              <ta-icon
                type="safety"
                class="slide-code-desc-icon"
              />
            </div>
            <span style="margin-left: 10px">立即验证</span>
          </div>
        </transition>
      </div>
    </ta-popover>
  </div>
</template>

<script>
import { animate, } from 'popmotion'

export default {
  data () {
    return {
      visible: false,
      imgLoaded: false,
      showButton: false,
      isDrag: false,
      isSoftDrag: false,
      isLoading: false,
      left: 0,
      tracks: [],
      softValidate: false,
      validate: null,
      realWidth: 0,

      slideCodeBgImg: require('../img/slide-bg.png'),
      slideCodeUpperImg: require('../img/slide-upper.png'),
    }
  },
  computed: {
    computedButtonLeft () {
      return `${this.left}px`
    },
    computedFillingDivLeft () {
      return `${this.left + 4}px`
    },
  },
  mounted () {
    document.addEventListener('mouseup', this.handleSlideButtonMouseUp)
    document.addEventListener('mousemove', this.handleSlideButtonMouseMove)
    this.$nextTick().then(() => {
      this.realWidth = this.$refs.slideCodeWrapper.getBoundingClientRect().width
    })
  },
  beforeDestroy () {
    document.removeEventListener('mouseup', this.handleSlideButtonMouseUp)
    document.removeEventListener('mousemove', this.handleSlideButtonMouseMove)
  },
  methods: {
    handlePopoverMouseEnter () {
      if (this.mouseLeaveTimer) clearTimeout(this.mouseLeaveTimer)
    },
    handleSlideCodeReferenceMouseEnter () {
      if (this.validate === 'success') return
      if (this.mouseLeaveTimer) {
        clearTimeout(this.mouseLeaveTimer)
      }
      // 这里请求后端验证码信息(图片等)
      !this.imgLoaded && new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      }).then(() => {
        this.imgLoaded = true
        this.visible = true
      })
      if (this.imgLoaded) this.visible = true
    },
    handleSlideCodeReferenceMouseLeave (e) {
      if (this.isDrag || this.isSoftDrag || this.validate === 'success') return
      this.mouseLeaveTimer = setTimeout(() => {
        this.visible = false
      }, 250)
    },
    handleSlideButtonMouseDown (e) {
      if (this.validate === 'success' || this.isDrag || this.isSoftDrag || !this.imgLoaded) return
      this.isDrag = true
      this.isSoftDrag = true
      this.mouseStart = e.pageX
      this.tracks.push(this.mouseStart)
    },
    handleSlideButtonMouseUp (e) {
      if (this.validate === 'success' || !this.isDrag || !this.isSoftDrag || !this.imgLoaded) return

      // 跟背景图来说相对于左边的距离  px;
      // eslint-disable-next-line no-unused-vars
      const m = this.computedButtonLeft
      // eslint-disable-next-line no-unused-vars
      const n = this.computedFillingDivLeft

      this.isSoftDrag = false
      // 相对于整个页面距离左边距离
      this.mouseEnd = e.pageX
      this.tracks.push(this.mouseEnd)
      new Promise((resolve, reject) => {
        this.isLoading = true

        // 这里可以请求后端验证
        setTimeout(() => {
          if (Math.random() >= 0.5) {
            resolve()
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('错误')
          }
        })
      }).then(() => {
        this.isLoading = false
        this.softValidate = true
        setTimeout(() => {
          this.validate = 'success'
          this.visible = false
          this.$emit('validate', {
            status: 'success',
            tracks: this.tracks,
          })
        }, 1000)
      }).catch((data) => {
        this.validate = 'failed'
        this.isLoading = false
        this.$emit('validate', {
          status: 'failed',
          tracks: this.tracks,
        })
        setTimeout(() => {
          if (this.validate === 'failed') {
            animate({
              from: this.left,
              to: 0,
              onUpdate: latest => this.left = latest,
              onComplete: () => {
                this.tracks = []
                this.validate = null
              },
            })
          }
        }, 1000)
      }).finally(() => {
        this.isDrag = false
      })
    },
    handleSlideButtonMouseMove (e) {
      if (!this.isDrag || !this.isSoftDrag || this.validate === 'success' || !this.imgLoaded) return
      this.tracks.push(e.pageX)
      this.left = Math.max(Math.min(e.pageX - this.mouseStart, this.realWidth - 40), 0)
    },
    reset () {
      this.visible = false
      this.imgLoaded = false
      this.showButton = false
      this.isDrag = false
      this.isSoftDrag = false
      this.isLoading = false
      this.left = 0
      this.tracks = []
      this.softValidate = false
      this.validate = null
    },
  },
}
</script>

<style lang="less" scoped>

.slide-code-wrapper {
  width: 100%;
  transition: box-shadow 0.5s;

  &:hover {
    box-shadow: @box-shadow-base;
  }

  .slide-code-validate-success {
    height: 40px;
    line-height: 40px;
    border-radius: @border-radius-base;
    background-color: @success-color;
    text-align: center;
    user-select: none;
    cursor: pointer;

    &-icon {
      color: #ffffff;
    }

    &-desc {
      color: #ffffff;
      margin-left: 10px;
    }
  }

  .slide-code-content {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;

    .slide-code-desc {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: @border-radius-base;
      background-color: rgba(0, 165, 255, 0.3);
      text-align: center;
      user-select: none;
      cursor: pointer;

      &-icon-wrapper {
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        background-color: rgba(0, 165, 255, 1);
        vertical-align: text-bottom;

        .wave-anim {
          position: absolute;
          left: 0;
          z-index: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(0, 165, 255, 1);

          &:nth-child(1) {
            animation: circle-wave 2s infinite;
          }

          &:nth-child(2) {
            animation: circle-wave 2s infinite;
            animation-delay: 0.5s;
          }

          @keyframes circle-wave {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(2);
            }
          }

        }
      }

      &-icon {
        position: absolute;
        left: 4px;
        top: 4px;
        color: white;
        font-size: 12px;
        z-index: 1;

        & /deep/ path:nth-child(2) {
          display: none;
        }
      }
    }

    .slide-code-button-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border: 1px @border-color-base solid;
      border-radius: @border-radius-base;

      .slide-code-filling {
        display: inline-block;
        position: absolute;
        z-index: 0;
        border-radius: 4px 0 0 4px;
        width: 4px;
        height: 100%;
        background-color: rgba(0, 165, 255, 1);
        transition: background-color 0.5s;

        &.error{
          background-color: @error-color;
        }

        &.success{
          background-color: @success-color;
        }
      }

      .slide-code-button {
        display: inline-block;
        position: absolute;
        z-index: 1;
        width: 40px;
        height: 100%;
        line-height: 38px;
        text-align: center;
        font-size: 16px;
        border: 1px @border-color-base solid;
        border-radius: @border-radius-base;
        box-shadow: @box-shadow-base;
        background-color: white;
        cursor: move;

        &.success{
          color: @success-color;
        }

        &.loading{
          color: rgba(0, 165, 255, 1);
        }

        &.error {
          color: @error-color;
        }
      }

      .slide-code-operation-desc {
        display: inline-block;
        height: 100%;
        margin-left: 50px;
        line-height: 40px;
        vertical-align: top;
        user-select: none;
      }

      .slide-code-operation-desc-icon {
        display: inline-block;
        position: relative;
        vertical-align: top;
        line-height: 40px;

        & /deep/ i {
          color: #aaa;

          &:nth-child(2) {
            position: absolute;
            left: 0;
            top: calc(50% - 7px);
            height: 14px;
            animation: arrow-move 1s infinite;

            @keyframes arrow-move {
              from {
                opacity: 1;
                transform: translateX(0px);
              }
              to {
                opacity: 0;
                transform: translateX(20px);
              }
            }
          }
        }
      }
    }

  }
}

.side-code-popover-wrapper{
  height: 180px;
  width: 266px;
  /*width: 100%;*/
  border-radius: @border-radius-base;

  .slide-code-img-wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;

    .slide-code-bg-img {
      /*height: 100%;*/
      width: 100%;
      position: absolute;
    }
    .slide-code-upper-img {
      /*width: 100%;*/
      height: 228px;
      /*background-color: #00acd6;*/
      position: absolute;
    }
  }
}

.slide-code-bar-enter {
  opacity: 0;

  &-active {
    transition: opacity .5s;
  }

  &-to {
    opacity: 1;
  }
}

.slide-code-bar-leave {
  opacity: 1;

  &-active {
    transition: opacity .5s;
  }

  &-to {
    opacity: 0;
  }
}
</style>
<style>
.slide-code-popper{
  padding: 0;
}
</style>
