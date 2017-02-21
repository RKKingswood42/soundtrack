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
     
     var $row = $(template);
     
     var clickHandler = function() {
         var songNumber = $(this).attr('data-song-number');
         if (currentlyPlayingSong !== null){
             var prevSong = $('.song-item-number[data-song-number="'+currentlyPlayingSong + '"]');
             prevSong.html(currentlyPlayingSong);
         } if (currentlyPlayingSong !== songNumber) {
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSong = songNumber;
         } else if (currentlyPlayingSong === songNumber){
             $(this).html(playButtonTemplate);
             currentlyPlayingSong = null;
         }
         
     };
     
    var onHover = function(event) {
         var songNumberBox = $(this).find('.song-item-number');
         var songNumber = songNumberBox.attr('data-song-number');
         if (songNumber !== currentlyPlayingSong){
             songNumberBox.html(playButtonTemplate);
         }
     };
     var offHover = function(event) {
         var songNumberBox = $(this).find('.song-item-number');
         var songNumber = songNumberBox.attr('data-song-number');
         if (songNumber !== currentlyPlayingSong){
             songNumberBox.html(songNumber);
         }
     };
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var currentAlbum;
var setCurrentAlbum = function(album) {

     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
    
     $albumSongList.empty();
    
    
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };
 
 var playButtonTemplate = '<a class="album-song-button" id="play"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button" id="paused"><span class="ion-pause"></span></a>';

 var currentlyPlayingSong = null;

$(document).ready(function() {
    setCurrentAlbum(albumPersistance);    
});
   