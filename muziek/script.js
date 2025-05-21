document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeScreen = document.getElementById('home-screen');
    const playerScreen = document.getElementById('player-screen');
    const albumItems = document.querySelectorAll('.album-item');
    const favoriteItems = document.querySelectorAll('.favorite-item');
    const miniPlayer = document.querySelector('.mini-player');
    const backButton = document.querySelector('.back-button');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeElement = document.getElementById('current-time');
    const totalTimeElement = document.getElementById('total-time');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const playerCover = document.getElementById('player-cover');
    const miniCover = document.getElementById('mini-cover');
    const playerVisualizer = document.querySelector('.player-visualizer');

    // Audio Object
    const audio = new Audio();
    let isPlaying = false;
    let currentSongIndex = 0;

    // Song data
    const songs = [
        { title: 'Let Down', artist: 'Artist 1', cover: 'cover-1', file: 'music/let-down.mp3' },
        { title: '李羲承进行曲', artist: 'Artist 2', cover: 'cover-2', file: 'music/march.mp3' },
        { title: 'Kyu Kurarin', artist: 'Artist 3', cover: 'cover-3', file: 'music/kyu-kurarin.mp3' },
        { title: 'The cut that always bleeds', artist: 'Artist 4', cover: 'cover-4', file: 'music/the-cut-that-always-bleeds.mp3' },
        { title: 'Otsukare summer', artist: 'Artist 5', cover: 'cover-5', file: 'music/otsukare-summer.mp3' },
        { title: 'Ochame Kinou', artist: 'Artist 6', cover: 'cover-6', file: 'music/ochame-kinou.mp3' },
        { title: 'Give it to me', artist: 'Artist 7', cover: 'cover-7', file: 'music/give-it-to-me.mp3' },
        { title: 'Ela é Sensacional', artist: 'Artist 8', cover: 'cover-8', file: 'music/ela-e-sensacional.mp3' },
        { title: 'Havah nagilah', artist: 'Artist 9', cover: 'cover-9', file: 'music/havah-nagilah.mp3' },
        { title: 'Wind', artist: 'Artist 10', cover: 'cover-10', file: 'music/wind.mp3' }
    ];

    // Create visualizer bars
    function createVisualizer() {
        const barCount = 30; // Number of bars in the visualizer
        playerVisualizer.innerHTML = ''; // Clear existing bars
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            // Random initial height and animation delay
            bar.style.height = Math.floor(Math.random() * 25) + 5 + 'px';
            bar.style.animationDelay = (i * 0.05) + 's';
            playerVisualizer.appendChild(bar);
        }
    }

    // Load and play a song
    function loadSong(index) {
        const song = songs[index];
        audio.src = song.file;
        
        // Update UI
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = song.artist;
        
        // Update album covers
        playerCover.style.backgroundImage = document.getElementById(song.cover).style.backgroundImage;
        miniCover.style.backgroundImage = document.getElementById(song.cover).style.backgroundImage;
        
        // Create new visualizer
        createVisualizer();
    }

    // Play/Pause function
    function playPause() {
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'fas fa-play';
            miniPlayBtn.className = 'fas fa-play';
            isPlaying = false;
        } else {
            audio.play().catch(error => {
                console.error("Error playing audio:", error);
                alert("Unable to play audio. No audio file found or browser doesn't support audio playback.");
            });
            playIcon.className = 'fas fa-pause';
            miniPlayBtn.className = 'fas fa-pause';
            isPlaying = true;
        }
    }

    // Previous song function
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // Next song function
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
        }
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            // Update progress bar
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time displays
            currentTimeElement.textContent = formatTime(currentTime);
            totalTimeElement.textContent = formatTime(duration);
        }
    }

    // Format time to MM:SS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // Set progress when clicking on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }

    // Event Listeners
    
    // Switch to player screen when clicking on album
    albumItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playerScreen.classList.add('active');
            homeScreen.style.transform = 'translateY(-100%)';
            
            // Start playing automatically when selecting a song
            audio.play().then(() => {
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
                miniPlayBtn.className = 'fas fa-pause';
            }).catch(error => {
                console.error("Error playing audio:", error);
                alert("Unable to play audio. No audio file found or browser doesn't support audio playback.");
            });
        });
    });
    
    // Also handle favorite items clicks
    favoriteItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // We need to offset by the number of album items since these are later in the list
            currentSongIndex = index + 6; // Assuming 6 album items (adjust as needed)
            loadSong(currentSongIndex);
            playerScreen.classList.add('active');
            homeScreen.style.transform = 'translateY(-100%)';
            
            // Start playing automatically when selecting a song
            audio.play().then(() => {
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
                miniPlayBtn.className = 'fas fa-pause';
            }).catch(error => {
                console.error("Error playing audio:", error);
            });
        });
    });

    // Go back to home screen
    backButton.addEventListener('click', () => {
        playerScreen.classList.remove('active');
        homeScreen.style.transform = 'translateY(0)';
    });

    // Play/Pause
    playBtn.addEventListener('click', playPause);
    miniPlayBtn.addEventListener('click', playPause);

    // Previous/Next
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // Time/progress functions
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // When song ends, play next
    audio.addEventListener('ended', nextSong);

    // Mini player also opens player screen
    miniPlayer.addEventListener('click', (e) => {
        // Don't open player if clicking on control buttons
        if (!e.target.closest('.mini-controls')) {
            playerScreen.classList.add('active');
            homeScreen.style.transform = 'translateY(-100%)';
        }
    });

    // Initially load first song but don't play
    loadSong(currentSongIndex);
    
    // Create initial visualizer
    createVisualizer();
});
