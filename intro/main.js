const lines = document.querySelectorAll('.line');

lines.forEach((line, i) => {
  const children = Array.from(line.childNodes);
  line.innerHTML = ''; // 초기화

  children.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const letters = child.textContent.split('');
      letters.forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        applyStyle(span);
        line.appendChild(span);
      });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const styledSpan = document.createElement('span');
      styledSpan.style.cssText = child.getAttribute('style');
      const letters = child.textContent.split('');
      letters.forEach(letter => {
        const innerSpan = document.createElement('span');
        innerSpan.textContent = letter === ' ' ? '\u00A0' : letter;
        applyStyle(innerSpan);
        styledSpan.appendChild(innerSpan);
      });
      line.appendChild(styledSpan);
    }
  });

  // 모든 span에 애니메이션 적용
  const spans = line.querySelectorAll('span span, span:not(:has(span))');
  gsap.to(spans, {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    stagger: 0.05,
    delay: i * 0.8,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.to(spans, {
    x: -100,
    opacity: 0,
    filter: 'blur(8px)',
    stagger: 0.05,
    delay: 3 + i * 0.8,
    duration: 1.2,
    ease: 'power3.in'
  });
});

// 스타일 초기값 함수
function applyStyle(span) {
  span.style.opacity = 0;
  span.style.display = 'inline-block';
  span.style.transform = 'translateX(100px)';
  span.style.filter = 'blur(8px)';
}

// 메인으로 전환
setTimeout(() => {
  gsap.to('#main', {
    y: '-100vh',
    opacity: 1,
    duration: 1.5,
    ease: 'power3.out'
  });
}, 6000);
