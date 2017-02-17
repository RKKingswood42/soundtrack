var albumPersistance = {
    title: 'Patriarchal Bullsh*t',
    artist: 'The Persistance',
    label: 'LizWarren Media',
    year: '2017',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Nevertheless', duration: '7:42'},
        {title: '(I won\'t) Stand Down', duration: '2:15'},
        {title: 'Mr. Senator', duration: '5:29'},
        {title: 'Anthem', duration: '3:54'},
        {title: 'Discreet Indiscretion', duration: '4:12'}
    ]
};

var albumMoralDilemma = {
    title: "Moral Dilemma",
    artist: 'the Ethicists',
    label: 'Ivory Tower',
    year: '1995',
    albumArtUrl: 'assets/images/album_covers/03.png',
    songs: [
        {title: 'Eudaimonia', duration: '1:20'},
        {title: 'Categorical Imperative', duration: '13:09'},
        {title: 'Satisfied Stoic', duration: '0:12'},
        {title: 'Greatest Good, Greatest Number', duration: '2:55'},
        {title: 'Everyone\'s a Murderer', duration: '4:21'}
    ]
};

var albumHecticGlow = {
    title: "Semantic Underground",
    artist: 'the Hectic Glow',
    label: 'Nerdfighteria Inc.',
    year: 2007,
    albumArtUrl: 'assets/images/album_covers/02.png',
    songs: [
        {title: 'French the Llama', duration: '2:32'},
        {title: 'Brandish', duration: '3:49'},
        {title: 'Who is Hank?', duration: '0:12'},
        {title: 'Complexly', duration: '2:55'},
        {title: 'Liking Things', duration: '4:21'}
    ]
};

var albums = [albumPersistance, albumMoralDilemma, albumHecticGlow];

 var createSongRow = function(songNumber, songName, songLength) {
     var template = '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';
     
     return template;
 };
var currentAlbum;
var setCurrentAlbum = function(album) {

     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
    
     albumSongList.innerHTML = '';
    
    
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };
 
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');

 var playButtonTemplate = '<a class="album-song-button" id="play"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button" id="paused"><span class="ion-pause"></span></a>';

 var currentlyPlayingSong = null;

window.onload = function() {
     setCurrentAlbum(albumPersistance);
 };


var index=0;
var waitForClick = document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function() {
        if (index === albums.length){index=0;}
        setCurrentAlbum(albums[index]);
        index++;
    }
);

     songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item' && getSongItem(event.target).getAttribute('data-song-number') !== currentlyPlayingSong) {
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
         }
         
          songListContainer.addEventListener('click', function(event){
               clickHandler(event.target);
     });

        for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
           
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
 
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });
     }
});

var findParentByClassName = function(element, targetClass) {
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className != targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        if (currentParent === null){
            console.log('This element has no parent.');
            return;
        }
        else if (currentParent.className === null){
            console.log('There is no parent element with this class');
            return;
        }
        return currentParent;
    }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

 var clickHandler = function(targetElement) {
      var songItem = getSongItem(targetElement);

     if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }

 };

     