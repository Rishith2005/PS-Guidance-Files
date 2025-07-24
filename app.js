// Main application file
import { questions } from './questions.js';
import { calculateResults } from './results.js';
import { animations } from './animations.js';

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress');
const questionCounter = document.getElementById('question-counter');
const resultsContainer = document.getElementById('results-container');
const restartBtn = document.getElementById('restart-btn');

// Application state
let currentQuestionIndex = 0;
let userAnswers = [];

// Initialize the application
function initApp() {
  startBtn.addEventListener('click', startQuiz);
  prevBtn.addEventListener('click', showPreviousQuestion);
  nextBtn.addEventListener('click', showNextQuestion);
  restartBtn.addEventListener('click', restartQuiz);
  
  // Pre-populate user answers array with nulls
  userAnswers = Array(questions.length).fill(null);
}

// Start the quiz
function startQuiz() {
  animations.fadeOut(welcomeScreen, () => {
    animations.fadeIn(questionScreen);
    showQuestion(currentQuestionIndex);
    updateProgress();
  });
}

// Show a specific question
function showQuestion(index) {
  // Clear the question container
  questionContainer.innerHTML = '';
  
  // Create the question element
  const question = questions[index];
  const questionElement = document.createElement('div');
  questionElement.classList.add('question');
  
  // Create question title
  const titleElement = document.createElement('h3');
  titleElement.classList.add('question-title');
  titleElement.textContent = question.text;
  questionElement.appendChild(titleElement);
  
  // Create options
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');
  
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.textContent = option.text;
    
    // Check if this option is selected
    if (userAnswers[index] === optionIndex) {
      optionElement.classList.add('selected');
    }
    
    // Add click event listener
    optionElement.addEventListener('click', () => {
      // Remove selected class from all options
      const options = optionsContainer.querySelectorAll('.option');
      options.forEach(opt => opt.classList.remove('selected'));
      
      // Add selected class to clicked option
      optionElement.classList.add('selected');
      
      // Update user answers
      userAnswers[index] = optionIndex;
      
      // Enable next button
      nextBtn.disabled = false;
    });
    
    optionsContainer.appendChild(optionElement);
  });
  
  questionElement.appendChild(optionsContainer);
  questionContainer.appendChild(questionElement);
  
  // Update button states
  prevBtn.disabled = index === 0;
  nextBtn.disabled = userAnswers[index] === null;
  
  // Update question counter
  questionCounter.textContent = `Question ${index + 1}/${questions.length}`;
}

// Show the next question
function showNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    animations.fadeOut(questionContainer, () => {
      showQuestion(currentQuestionIndex);
      animations.fadeIn(questionContainer);
    });
    updateProgress();
  } else {
    showResults();
  }
}

// Show the previous question
function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    animations.fadeOut(questionContainer, () => {
      showQuestion(currentQuestionIndex);
      animations.fadeIn(questionContainer);
    });
    updateProgress();
  }
}

// Update progress bar
function updateProgress() {
  const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${percentage}%`;
}

// Show the results
function showResults() {
  animations.fadeOut(questionScreen, () => {
    // Calculate results
    const results = calculateResults(userAnswers, questions);
    
    // Display results
    displayResults(results);
    
    // Show results screen
    animations.fadeIn(resultsScreen);
  });
}

// Display results
function displayResults(results) {
  resultsContainer.innerHTML = '';
  
  // Create results header
  const resultTitle = document.createElement('h3');
  resultTitle.classList.add('result-title');
  resultTitle.textContent = results.title;
  resultsContainer.appendChild(resultTitle);
  
  const resultDescription = document.createElement('p');
  resultDescription.classList.add('result-description');
  resultDescription.textContent = results.description;
  resultsContainer.appendChild(resultDescription);
  
  // Create career matches section
  const careerMatchesTitle = document.createElement('h4');
  careerMatchesTitle.textContent = 'Your Top Career Matches';
  careerMatchesTitle.style.marginBottom = 'var(--space-2)';
  resultsContainer.appendChild(careerMatchesTitle);
  
  const careerMatches = document.createElement('div');
  careerMatches.classList.add('career-matches');
  
  // Add each career match
  results.matches.forEach(match => {
    const matchElement = document.createElement('div');
    matchElement.classList.add('career-match');
    
    // Create percentage bar
    const percentageBar = document.createElement('div');
    percentageBar.classList.add('match-percentage');
    
    const bar = document.createElement('div');
    bar.classList.add('percentage-bar');
    
    const fill = document.createElement('div');
    fill.classList.add('percentage-fill');
    bar.appendChild(fill);
    
    const percentText = document.createElement('span');
    percentText.classList.add('percentage-text');
    percentText.textContent = `${match.percentage}%`;
    
    percentageBar.appendChild(bar);
    percentageBar.appendChild(percentText);
    matchElement.appendChild(percentageBar);
    
    // Career title
    const matchTitle = document.createElement('h5');
    matchTitle.classList.add('match-title');
    matchTitle.textContent = match.title;
    matchElement.appendChild(matchTitle);
    
    // Career description
    const matchDescription = document.createElement('p');
    matchDescription.classList.add('match-description');
    matchDescription.textContent = match.description;
    matchElement.appendChild(matchDescription);
    
    // Skills
    const skillsContainer = document.createElement('div');
    skillsContainer.classList.add('match-skills');
    
    match.skills.forEach(skill => {
      const skillTag = document.createElement('span');
      skillTag.classList.add('skill-tag');
      skillTag.textContent = skill;
      skillsContainer.appendChild(skillTag);
    });
    
    matchElement.appendChild(skillsContainer);
    careerMatches.appendChild(matchElement);
  });
  
  resultsContainer.appendChild(careerMatches);
  
  // Animate percentage bars after a short delay
  setTimeout(() => {
    const fills = document.querySelectorAll('.percentage-fill');
    fills.forEach((fill, index) => {
      const percentage = results.matches[index].percentage;
      fill.style.width = `${percentage}%`;
    });
  }, 500);
}

// Restart the quiz
function restartQuiz() {
  // Reset state
  currentQuestionIndex = 0;
  userAnswers = Array(questions.length).fill(null);
  
  // Reset UI
  animations.fadeOut(resultsScreen, () => {
    animations.fadeIn(welcomeScreen);
  });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);