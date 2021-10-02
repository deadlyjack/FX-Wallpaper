import tag from 'html-tag-js';

/**
 *
 * @param {String} strokeColor
 */
export default function ProgressBar(strokeColor = '#39f') {
  const pixelRatio = window.devicePixelRatio;
  const lineWidth = 5 * pixelRatio;
  const HEIGHT = Math.min(Math.min(window.innerWidth * 0.2, 80), 150);
  const WIDTH = HEIGHT;

  let $canvas = tag('canvas', {
    className: 'progress-loader',
    style: {
      color: strokeColor,
      height: `${HEIGHT}px`,
      width: `${WIDTH}px`,
    },
    height: HEIGHT * pixelRatio,
    width: WIDTH * pixelRatio,
  });
  let $percentageText = tag('span', {
    className: 'progress-meter',
    textContent: '0%',
    style: {
      color: strokeColor,
      height: `${HEIGHT}px`,
      width: `${WIDTH}px`,
    },
  });
  const $messageText = tag('span', {
    className: 'progress-message',
    style: {
      color: strokeColor,
      paddingTop: `${HEIGHT + 40}px`,
    },
  });
  const $mask = tag('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 9,
    },
  });
  let ctx = $canvas.getContext('2d');
  let animationFrame;
  let end = 0;
  let animate = false;
  let animatingAt = null;
  let start = 0;
  let endSpeed = 0.03;
  let startSpeed = 0.003;
  let textVisible = false;
  let destroyed = false;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 4;

  animation();
  function animation() {
    render();
    animationFrame = window.requestAnimationFrame(animation);
  }

  function render() {
    if (animate) {
      start += startSpeed;
      end += endSpeed;

      if (end >= 1) {
        end = 0;
        const acc = endSpeed;
        endSpeed = startSpeed;
        startSpeed = acc;
      }

      if (start >= 1) {
        start = 0;
        const acc = startSpeed;
        startSpeed = endSpeed;
        endSpeed = acc;
      }
    }
    const r = (WIDTH * pixelRatio) / 2;
    ctx.clearRect(0, 0, $canvas.width, $canvas.width);
    ctx.beginPath();
    ctx.arc(r, r, r - lineWidth, 2 * start * Math.PI, 2 * end * Math.PI, false);
    ctx.stroke();
  }

  return {
    show() {
      if (IS_ANDROID) {
        window.StatusBar.backgroundColorByHexString('#131318');
        window.NavigationBar.backgroundColorByHexString('#131318', false);
      }
      app.append($mask, $canvas);
      if (textVisible) app.append($percentageText);
      app.append($messageText);
      return this;
    },
    /**
     *
     * @param {Number} percentage
     */
    progress(percentage) {
      if (animatingAt === percentage) return this;

      start = 0;
      animatingAt = null;
      animate = false;
      end = percentage / 100;
      if ($percentageText) {
        $percentageText.textContent = `${percentage.toFixed(1)}%`;
      }
      return this;
    },
    hide() {
      if (IS_ANDROID) {
        window.StatusBar.backgroundColorByHexString('#212028');
        window.NavigationBar.backgroundColorByHexString('#212028', false);
      }
      this.progress(0);
      if ($canvas.isConnected) $canvas.remove();
      if ($percentageText.isConnected) $percentageText.remove();
      if ($messageText.isConnected) $messageText.remove();
      if ($mask.isConnected) $mask.remove();
      return this;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      this.hide();
      $canvas = null;
      $percentageText = null;
      ctx = null;
      window.cancelAnimationFrame(animationFrame);
    },
    animate() {
      animatingAt = end;
      animate = true;
      return this;
    },
    /**
     *
     * @param {Boolean} val
     */
    showValue(val) {
      if (val) {
        textVisible = true;
        if (!$percentageText.isConnected) app.append($percentageText);
      } else {
        textVisible = false;
        if ($percentageText.isConnected) $percentageText.remove();
      }

      return this;
    },
    message(text) {
      $messageText.textContent = text;
    },
  };
}
