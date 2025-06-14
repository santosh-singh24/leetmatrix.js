document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");  
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const totalSolved = document.getElementById("total-solved");
    const easySolved = document.getElementById("easy-solved");
    const mediumSolved = document.getElementById("medium-solved");
    const hardSolved = document.getElementById("hard-solved");

    // Show circles by default with 0% progress
    function resetProgress() {
        easyProgressCircle.style.background = "conic-gradient(#1a1b26 100%, #1a1b26 100%)";
        mediumProgressCircle.style.background = "conic-gradient(#1a1b26 100%, #1a1b26 100%)";
        hardProgressCircle.style.background = "conic-gradient(#1a1b26 100%, #1a1b26 100%)";
        
        easyLabel.textContent = "Easy";
        mediumLabel.textContent = "Medium";
        hardLabel.textContent = "Hard";
        
        statsContainer.style.display = "block"; // Show stats section
        totalSolved.textContent = "0";
        easySolved.textContent = "0";
        mediumSolved.textContent = "0";
        hardSolved.textContent = "0";
    }
    
    resetProgress(); // Call this function on page load

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || data.status === "error") {
                throw new Error("Invalid username or no data available");
            }

            const problemsArray = [
                { difficulty: "Easy", count: data.easySolved, total: data.totalEasy },
                { difficulty: "Medium", count: data.mediumSolved, total: data.totalMedium },
                { difficulty: "Hard", count: data.hardSolved, total: data.totalHard }
            ];
            
            displayUserData(problemsArray);
        } catch (error) {
            console.error("Error:", error);
            statsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function displayUserData(problemsArray) {
        updateProgress(easyProgressCircle, easyLabel, problemsArray[0].count, problemsArray[0].total);
        updateProgress(mediumProgressCircle, mediumLabel, problemsArray[1].count, problemsArray[1].total);
        updateProgress(hardProgressCircle, hardLabel, problemsArray[2].count, problemsArray[2].total);
        
        // Update stat cards
        const total = problemsArray.reduce((sum, problem) => sum + problem.count, 0);
        totalSolved.textContent = total;
        easySolved.textContent = problemsArray[0].count;
        mediumSolved.textContent = problemsArray[1].count;
        hardSolved.textContent = problemsArray[2].count;
    }

    function updateProgress(circleElement, labelElement, solved, total) {
        const percentage = Math.round((solved / total) * 100);
        let color;
        
        // Different colors for different difficulty levels
        if (circleElement.classList.contains('easy-progress')) {
            color = '#9ece6a'; // Green for easy
        } else if (circleElement.classList.contains('medium-progress')) {
            color = '#e0af68'; // Yellow for medium
        } else {
            color = '#f7768e'; // Red for hard
        }
        
        circleElement.style.background = `conic-gradient(${color} ${percentage}%, #1a1b26 ${percentage}%)`;
        labelElement.textContent = `${solved}/${total}`;
        labelElement.style.color = color;
    }

    searchButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (username) {
            fetchUserDetails(username);
        } else {
            alert("Please enter a username");
        }
    });
});
