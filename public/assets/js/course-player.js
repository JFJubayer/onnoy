/**
 * Onnoy (অন্বয়) - Course Player & Interactive Quiz Controller
 * Integrates YouTube IFrame Player API with timestamp seeking,
 * onboarding modal, 5-question quiz validation, and lesson progression.
 */

(function () {
  let ytPlayer = null;
  let ytApiReady = false;
  let activeLessonId = null;
  let currentStudent = null;
  let returnScrollPosition = 0;

  // Initialize once DOM is loaded
  document.addEventListener('DOMContentLoaded', initCourse);

  function initCourse() {
    currentStudent = OnnoyCourseStore.getStudent();
    setupStudentModal();
    setupEventListeners();

    if (!currentStudent) {
      showStudentModal(true);
    } else {
      updateStudentHeader();
    }

    const activeCourse = OnnoyCourseStore.getCourse();
    document.title = `${activeCourse.title} | Onnoy-অন্বয়`;
    const courseEyebrow = document.getElementById('course-eyebrow-name');
    if (courseEyebrow) {
      courseEyebrow.textContent = activeCourse.title;
    }
    const sidebarCount = document.getElementById('sidebar-lessons-count');
    if (sidebarCount) {
      sidebarCount.textContent = `${activeCourse.lessons.length} Lessons`;
    }

    // Determine starting lesson
    const progress = OnnoyCourseStore.getProgress();
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLesson = urlParams.get('lesson');

    if (requestedLesson && ONNOY_COURSE_LESSONS.some(l => l.id === requestedLesson)) {
      if (OnnoyCourseStore.isLessonUnlocked(requestedLesson)) {
        activeLessonId = requestedLesson;
      } else {
        activeLessonId = progress.currentLessonId || ONNOY_COURSE_LESSONS[0].id;
      }
    } else {
      activeLessonId = progress.currentLessonId || ONNOY_COURSE_LESSONS[0].id;
    }

    loadActiveLesson();
    loadYouTubeApi();
  }

  /* -------------------------------------------------------------
     YouTube Iframe API Integration
  ------------------------------------------------------------- */
  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
      ytApiReady = true;
      initPlayerForActiveLesson();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else if (document.head) {
      document.head.appendChild(tag);
    } else if (document.body) {
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function () {
      ytApiReady = true;
      initPlayerForActiveLesson();
    };
  }

  function initPlayerForActiveLesson() {
    const lesson = ONNOY_COURSE_LESSONS.find(l => l.id === activeLessonId);
    if (!lesson) return;

    // Reset error notices
    const errorNotice = document.getElementById('player-embed-error-notice');
    if (errorNotice) {
      errorNotice.style.display = 'none';
      errorNotice.classList.add('hidden');
    }

    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(lesson.videoId);
    } else {
      const isHttp = window.location.protocol.startsWith('http');
      ytPlayer = new YT.Player('onnoy-yt-player', {
        height: '100%',
        width: '100%',
        videoId: lesson.videoId,
        playerVars: {
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: isHttp ? window.location.origin : undefined
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    }
  }

  function onPlayerReady(event) {
    // Player is ready
    const notice = document.getElementById('player-loading-notice');
    if (notice) notice.style.display = 'none';

    try {
      if (event && event.target && event.target.getIframe) {
        const iframe = event.target.getIframe();
        if (iframe) {
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        }
      }
    } catch (e) {
      // safe fallback
    }
  }

  function onPlayerError(event) {
    console.warn('YouTube Player Error code:', event.data);
    const lesson = ONNOY_COURSE_LESSONS.find(l => l.id === activeLessonId);
    if (!lesson) return;

    // Error codes:
    // 2: Invalid parameter
    // 5: HTML5 error
    // 100: Video not found or private
    // 101/150: Video owner has disabled playback in embedded players
    const errorNotice = document.getElementById('player-embed-error-notice');
    if (errorNotice) {
      errorNotice.style.display = 'block';
      errorNotice.classList.remove('hidden');
      const directLink = document.getElementById('error-direct-yt-link');
      if (directLink) {
        directLink.href = `https://www.youtube.com/watch?v=${lesson.videoId}`;
      }
    }
  }

  function onPlayerStateChange(event) {
    // YT.PlayerState.ENDED is 0
    if (event.data === 0) {
      showVideoCompletedBanner();
    }
  }

  function showVideoCompletedBanner() {
    const banner = document.getElementById('video-finished-banner');
    if (banner) {
      banner.classList.remove('hidden');
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* -------------------------------------------------------------
     Student Onboarding / Profile Management
  ------------------------------------------------------------- */
  function setupStudentModal() {
    const modal = document.getElementById('student-modal');
    const form = document.getElementById('student-enroll-form');
    const closeBtn = document.getElementById('close-student-modal');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('student-name').value.trim();
        const institution = document.getElementById('student-institution').value.trim();
        const age = parseInt(document.getElementById('student-age').value.trim(), 10);
        const grade = document.getElementById('student-grade').value.trim();
        const district = document.getElementById('student-district').value.trim();
        const email = document.getElementById('student-email').value.trim();

        if (!name || !institution || !age || isNaN(age)) {
          alert('Please fill in your Name, School/College, and Age.');
          return;
        }

        currentStudent = OnnoyCourseStore.saveStudent({
          name,
          institution,
          age,
          grade,
          district,
          email
        });

        updateStudentHeader();
        hideStudentModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (currentStudent) {
          hideStudentModal();
        } else {
          alert('Please provide your student information to access the course.');
        }
      });
    }
  }

  function showStudentModal(isForced = false) {
    const modal = document.getElementById('student-modal');
    const closeBtn = document.getElementById('close-student-modal');
    if (!modal) return;

    if (currentStudent) {
      document.getElementById('student-name').value = currentStudent.name || '';
      document.getElementById('student-institution').value = currentStudent.institution || '';
      document.getElementById('student-age').value = currentStudent.age || '';
      if (currentStudent.grade) document.getElementById('student-grade').value = currentStudent.grade;
      if (currentStudent.district) document.getElementById('student-district').value = currentStudent.district;
      if (currentStudent.email) document.getElementById('student-email').value = currentStudent.email;
    }

    if (isForced && !currentStudent) {
      if (closeBtn) closeBtn.style.display = 'none';
    } else {
      if (closeBtn) closeBtn.style.display = 'block';
    }

    modal.classList.add('active');
  }

  function hideStudentModal() {
    const modal = document.getElementById('student-modal');
    if (modal) modal.classList.remove('active');
  }

  function updateStudentHeader() {
    const nameEl = document.getElementById('current-student-name');
    const instEl = document.getElementById('current-student-institution');
    if (nameEl && currentStudent) {
      nameEl.textContent = currentStudent.name;
    }
    if (instEl && currentStudent) {
      instEl.textContent = currentStudent.institution ? `(${currentStudent.institution})` : '';
    }
  }

  /* -------------------------------------------------------------
     Lesson Loading & UI Render
  ------------------------------------------------------------- */
  function loadActiveLesson() {
    const lesson = ONNOY_COURSE_LESSONS.find(l => l.id === activeLessonId);
    if (!lesson) return;

    // Update Titles
    const titleEl = document.getElementById('active-lesson-title');
    const numEl = document.getElementById('active-lesson-num');
    const descEl = document.getElementById('active-lesson-desc');

    if (titleEl) titleEl.textContent = lesson.title;
    if (numEl) numEl.textContent = `Lesson ${lesson.lessonNumber} of ${ONNOY_COURSE_LESSONS.length}`;
    if (descEl) descEl.textContent = lesson.summary;

    const ytBtn = document.getElementById('active-lesson-yt-btn');
    if (ytBtn) {
      ytBtn.href = `https://www.youtube.com/watch?v=${lesson.videoId}`;
    }

    // Hide any previous review banner
    const returnBanner = document.getElementById('return-to-quiz-banner');
    if (returnBanner) returnBanner.classList.add('hidden');

    const videoFinishedBanner = document.getElementById('video-finished-banner');
    if (videoFinishedBanner) videoFinishedBanner.classList.add('hidden');

    // Render Quiz for this lesson
    renderLessonQuiz(lesson);

    // If player ready, load video
    if (ytPlayer && ytPlayer.loadVideoById) {
      ytPlayer.loadVideoById(lesson.videoId);
    }

    renderLessonSidebar();
    renderCourseProgressBar();

    // Scroll smoothly to top of player
    const mainSection = document.getElementById('course-player-container');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderLessonSidebar() {
    const container = document.getElementById('course-playlist-items');
    if (!container) return;

    container.innerHTML = '';
    const progress = OnnoyCourseStore.getProgress();

    ONNOY_COURSE_LESSONS.forEach((lesson, idx) => {
      const isCompleted = OnnoyCourseStore.isLessonCompleted(lesson.id);
      const isUnlocked = OnnoyCourseStore.isLessonUnlocked(lesson.id);
      const isActive = lesson.id === activeLessonId;

      const item = document.createElement('div');
      item.className = `playlist-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
      item.setAttribute('data-id', lesson.id);

      let iconHtml = '';
      let badgeHtml = '';

      if (isCompleted) {
        iconHtml = `<span class="status-icon icon-completed" title="Completed">✓</span>`;
        badgeHtml = `<span class="badge badge-success">Passed</span>`;
      } else if (isActive) {
        iconHtml = `<span class="status-icon icon-active" title="Current Lesson">▶</span>`;
        badgeHtml = `<span class="badge badge-active">Playing</span>`;
      } else if (isUnlocked) {
        iconHtml = `<span class="status-icon icon-unlocked" title="Unlocked">${lesson.lessonNumber}</span>`;
        badgeHtml = `<span class="badge badge-unlocked">Ready</span>`;
      } else {
        iconHtml = `<span class="status-icon icon-locked" title="Locked">🔒</span>`;
        badgeHtml = `<span class="badge badge-locked">Locked</span>`;
      }

      item.innerHTML = `
        <div class="playlist-item-left">
          ${iconHtml}
        </div>
        <div class="playlist-item-content">
          <div class="playlist-item-title">${lesson.lessonNumber}. ${lesson.title}</div>
          <div class="playlist-item-meta">
            <span class="lesson-duration">⏱ ${lesson.duration}</span>
            <span class="lesson-questions-count">📝 5 Questions</span>
            ${badgeHtml}
          </div>
        </div>
      `;

      item.addEventListener('click', function () {
        if (!isUnlocked) {
          alert(`Lesson ${lesson.lessonNumber} is locked! Please complete the previous lessons and score 5/5 on the questions to unlock it.`);
          return;
        }
        if (activeLessonId !== lesson.id) {
          activeLessonId = lesson.id;
          loadActiveLesson();
        }
      });

      container.appendChild(item);
    });
  }

  function renderCourseProgressBar() {
    const progress = OnnoyCourseStore.getProgress();
    const completedCount = progress.completedLessons ? progress.completedLessons.length : 0;
    const total = ONNOY_COURSE_LESSONS.length;
    const pct = Math.round((completedCount / total) * 100);

    const bar = document.getElementById('course-progress-fill');
    const label = document.getElementById('course-progress-text');
    const certBtn = document.getElementById('view-cert-cta-btn');
    const sidebarBox = document.getElementById('sidebar-cert-status-box');
    const sidebarIcon = document.getElementById('sidebar-cert-icon');
    const sidebarTitle = document.getElementById('sidebar-cert-title');
    const sidebarDesc = document.getElementById('sidebar-cert-desc');

    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${completedCount} of ${total} Lessons Completed (${pct}%)`;

    const isFinished = completedCount === total && total > 0 && progress.isCourseFinished;

    if (certBtn) {
      if (isFinished) {
        certBtn.style.display = 'inline-flex';
        certBtn.classList.remove('hidden');
      } else {
        certBtn.style.display = 'none';
        certBtn.classList.add('hidden');
      }
    }

    if (sidebarBox) {
      if (isFinished) {
        if (sidebarIcon) sidebarIcon.textContent = '🏅';
        if (sidebarTitle) {
          sidebarTitle.textContent = 'Certificate Unlocked! 🎉';
          sidebarTitle.style.color = 'var(--green)';
        }
        if (sidebarDesc) {
          sidebarDesc.innerHTML = '<a href="javascript:void(0)" id="sidebar-claim-cert-link" style="color: var(--green); font-weight: 700; text-decoration: underline;">Click to Claim Your Certificate 🎓</a>';
          const link = document.getElementById('sidebar-claim-cert-link');
          if (link) link.onclick = openCertificateModal;
        }
        sidebarBox.style.borderColor = 'var(--green)';
        sidebarBox.style.background = 'var(--green-pale)';
      } else {
        if (sidebarIcon) sidebarIcon.textContent = '🔒';
        if (sidebarTitle) {
          sidebarTitle.textContent = `Certificate Locked (${completedCount}/${total} Passed)`;
          sidebarTitle.style.color = 'var(--ink-mid)';
        }
        if (sidebarDesc) {
          sidebarDesc.textContent = 'Unlocks automatically after completing all 5 lessons and passing all quizzes.';
        }
        sidebarBox.style.borderColor = 'var(--border)';
        sidebarBox.style.background = 'var(--paper)';
      }
    }
  }

  /* -------------------------------------------------------------
     Interactive 5-Question Quiz Flow & Timestamp Jump
  ------------------------------------------------------------- */
  function renderLessonQuiz(lesson) {
    const quizContainer = document.getElementById('quiz-questions-list');
    const quizStatus = document.getElementById('quiz-status-pill');
    const quizFeedback = document.getElementById('quiz-result-feedback');

    if (!quizContainer) return;
    quizContainer.innerHTML = '';
    if (quizFeedback) quizFeedback.innerHTML = '';

    const isCompleted = OnnoyCourseStore.isLessonCompleted(lesson.id);
    if (quizStatus) {
      if (isCompleted) {
        quizStatus.className = 'quiz-status-pill pill-passed';
        quizStatus.innerHTML = '✓ Completed (5/5 Correct)';
      } else {
        quizStatus.className = 'quiz-status-pill pill-pending';
        quizStatus.innerHTML = '5 Questions Required to Unlock Next';
      }
    }

    lesson.questions.forEach((q, idx) => {
      const qCard = document.createElement('div');
      qCard.className = 'quiz-question-card';
      qCard.id = `q-card-${idx}`;

      const optionsHtml = q.options.map((opt, optIdx) => `
        <label class="quiz-option-label" for="opt_${idx}_${optIdx}">
          <input type="radio" name="quiz_q_${idx}" id="opt_${idx}_${optIdx}" value="${optIdx}">
          <span class="custom-radio"></span>
          <span class="option-text">${opt}</span>
        </label>
      `).join('');

      qCard.innerHTML = `
        <div class="question-header">
          <div class="question-title-wrap">
            <span class="question-badge">Q${idx + 1}</span>
            <h4 class="question-text">${q.question}</h4>
          </div>
          <button type="button" class="btn-rewatch-timestamp" data-timestamp="${q.timestamp}" data-question-num="${idx + 1}" title="Seek video to where this concept is explained">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
            <span>Rewatch at ${q.timestampLabel}</span>
          </button>
        </div>
        <p class="question-bilingual-hint">${q.questionBn}</p>
        <div class="quiz-options-group">
          ${optionsHtml}
        </div>
        <div class="question-explanation hidden" id="explanation-${idx}">
          <div class="explanation-inner">
            <strong>Key takeaway:</strong> ${q.explanation}
          </div>
        </div>
      `;

      quizContainer.appendChild(qCard);
    });

    // Attach rewatch click listeners
    const rewatchButtons = quizContainer.querySelectorAll('.btn-rewatch-timestamp');
    rewatchButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const sec = parseInt(this.getAttribute('data-timestamp'), 10);
        const qNum = this.getAttribute('data-question-num');
        seekToTimestampAndNotify(sec, qNum);
      });
    });
  }

  /**
   * Seeks YouTube video to exact timestamp, plays, scrolls up, and displays return banner
   */
  function seekToTimestampAndNotify(seconds, questionNumber) {
    if (!ytPlayer) {
      alert('Video player is initializing. Please wait a moment.');
      return;
    }

    // Save scroll position where question is located
    const qCard = document.getElementById(`q-card-${questionNumber - 1}`);
    if (qCard) {
      returnScrollPosition = qCard.getBoundingClientRect().top + window.pageYOffset - 120;
    }

    // Seek and play
    if (typeof ytPlayer.seekTo === 'function') {
      ytPlayer.seekTo(seconds, true);
      ytPlayer.playVideo();
    }

    // Scroll up to video player smoothly
    const playerContainer = document.getElementById('course-player-container');
    if (playerContainer) {
      playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show persistent banner right above or below player
    const returnBanner = document.getElementById('return-to-quiz-banner');
    const returnBannerText = document.getElementById('return-banner-text');

    if (returnBanner && returnBannerText) {
      const minutes = Math.floor(seconds / 60);
      const remSeconds = seconds % 60;
      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remSeconds).padStart(2, '0')}`;

      returnBannerText.innerHTML = `Viewing topic for <strong>Question ${questionNumber}</strong> (Timestamp: ${formattedTime}).`;
      returnBanner.classList.remove('hidden');
    }
  }

  function handleQuizSubmission() {
    const lesson = ONNOY_COURSE_LESSONS.find(l => l.id === activeLessonId);
    if (!lesson) return;

    const total = lesson.questions.length;
    let correctCount = 0;
    let unansweredFound = false;

    // Validate and evaluate
    lesson.questions.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="quiz_q_${idx}"]:checked`);
      const card = document.getElementById(`q-card-${idx}`);
      const explanationEl = document.getElementById(`explanation-${idx}`);

      // Reset styles
      if (card) {
        card.classList.remove('state-correct', 'state-incorrect', 'state-unanswered');
      }

      if (!selected) {
        unansweredFound = true;
        if (card) card.classList.add('state-unanswered');
      } else {
        const val = parseInt(selected.value, 10);
        if (val === q.correctAnswer) {
          correctCount++;
          if (card) card.classList.add('state-correct');
        } else {
          if (card) card.classList.add('state-incorrect');
        }
        if (explanationEl) explanationEl.classList.remove('hidden');
      }
    });

    const feedbackEl = document.getElementById('quiz-result-feedback');

    if (unansweredFound) {
      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="alert alert-warning">
            ⚠️ Please answer all 5 questions before submitting. Unanswered questions are highlighted above.
          </div>
        `;
      }
      return;
    }

    if (correctCount === total) {
      // 5 / 5 Correct! Passed
      const updatedProgress = OnnoyCourseStore.markLessonComplete(activeLessonId, 5);
      renderLessonSidebar();
      renderCourseProgressBar();

      const isAllDone = updatedProgress.isCourseFinished;

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="alert alert-success">
            <h3>🎉 Outstanding! You scored 5/5!</h3>
            <p>You have mastered this lesson. ${isAllDone ? 'You have finished all lessons in this course!' : 'The next lesson has now unlocked!'}</p>
            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
              ${isAllDone 
                ? '<button type="button" class="btn btn-green" id="congrats-cert-btn">🎓 Claim Your Certificate</button>' 
                : '<button type="button" class="btn btn-green" id="next-lesson-btn">Proceed to Next Lesson →</button>'}
            </div>
          </div>
        `;

        if (isAllDone) {
          const btn = document.getElementById('congrats-cert-btn');
          if (btn) btn.addEventListener('click', openCertificateModal);
        } else {
          const btn = document.getElementById('next-lesson-btn');
          if (btn) {
            btn.addEventListener('click', function () {
              const currentIdx = ONNOY_COURSE_LESSONS.findIndex(l => l.id === activeLessonId);
              if (currentIdx + 1 < ONNOY_COURSE_LESSONS.length) {
                activeLessonId = ONNOY_COURSE_LESSONS[currentIdx + 1].id;
                loadActiveLesson();
              }
            });
          }
        }
      }
    } else {
      // Not 5/5
      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="alert alert-danger">
            <h3>Score: ${correctCount} / ${total} Correct</h3>
            <p>To ensure high quality learning, all 5 questions must be answered correctly to unlock the next lesson.</p>
            <p><strong>Tip:</strong> Click the <strong>"Rewatch at MM:SS"</strong> button on any question you missed to learn the exact answer directly from the video, then try again!</p>
            <button type="button" class="btn btn-secondary" id="retry-quiz-btn" style="margin-top: 10px;">Retry Missed Questions</button>
          </div>
        `;

        const retryBtn = document.getElementById('retry-quiz-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', function () {
            // Scroll to the first incorrect question
            const firstWrong = document.querySelector('.quiz-question-card.state-incorrect');
            if (firstWrong) {
              firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        }
      }
    }
  }

  function setupEventListeners() {
    // Edit Profile Button
    const editProfileBtn = document.getElementById('btn-edit-student-profile');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', function () {
        showStudentModal(false);
      });
    }

    // Submit Quiz Button
    const submitBtn = document.getElementById('btn-submit-lesson-quiz');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleQuizSubmission);
    }

    // Return to Quiz from Video Button
    const returnBtn = document.getElementById('btn-return-to-quiz');
    if (returnBtn) {
      returnBtn.addEventListener('click', function () {
        const returnBanner = document.getElementById('return-to-quiz-banner');
        if (returnBanner) returnBanner.classList.add('hidden');

        if (returnScrollPosition > 0) {
          window.scrollTo({ top: returnScrollPosition, behavior: 'smooth' });
        } else {
          const quizSec = document.getElementById('lesson-quiz-section');
          if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Certificate Trigger Buttons
    const viewCertBtn = document.getElementById('view-cert-cta-btn');
    if (viewCertBtn) {
      viewCertBtn.addEventListener('click', openCertificateModal);
    }

    // Jump to Quiz from Video Completed Banner
    const startQuizAfterVideoBtn = document.getElementById('btn-start-quiz-now');
    if (startQuizAfterVideoBtn) {
      startQuizAfterVideoBtn.addEventListener('click', function () {
        const quizSec = document.getElementById('lesson-quiz-section');
        if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Delegated click handler for Rewatch timestamp buttons
    const quizList = document.getElementById('quiz-questions-list');
    if (quizList) {
      quizList.addEventListener('click', function (e) {
        let target = e.target;
        while (target && target !== quizList) {
          if (target.classList && target.classList.contains('btn-rewatch-timestamp')) {
            const sec = parseInt(target.getAttribute('data-timestamp'), 10);
            const qNum = target.getAttribute('data-question-num');
            seekToTimestampAndNotify(sec, qNum);
            break;
          }
          target = target.parentNode;
        }
      });
    }
  }

  function openCertificateModal() {
    if (typeof window.OnnoyCertificateViewer === 'function') {
      window.OnnoyCertificateViewer();
    } else {
      alert('Certificate engine is ready. Completing all lessons enables download.');
    }
  }

  // Export functions to window
  window.OnnoyCoursePlayer = {
    loadLesson(lessonId) {
      if (OnnoyCourseStore.isLessonUnlocked(lessonId)) {
        activeLessonId = lessonId;
        loadActiveLesson();
      } else {
        alert('This lesson is locked until previous lessons are completed.');
      }
    },
    seekTo(seconds, qNum) {
      seekToTimestampAndNotify(seconds, qNum);
    },
    showProfileModal: showStudentModal
  };
})();
