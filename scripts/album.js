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


 var createSongRow = function (songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
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
     currentAlbum = albumTitle;
 };
 
 window.onload = function() {
     setCurrentAlbum(albumPersistance);
 };

var waitForClick = document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function() {
    if (currentAlbum.innerHTML === 'Patriarchal Bullsh*t'){
        setCurrentAlbum(albumHecticGlow);
    }
    else if (currentAlbum.innerHTML === 'Semantic Underground'){
        setCurrentAlbum(albumMoralDilemma);
    }
    else {
        setCurrentAlbum(albumPersistance);
    }
});
