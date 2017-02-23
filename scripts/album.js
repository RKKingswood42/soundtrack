var albums = [albumPersistance, albumMoralDilemma, albumHecticGlow];

 var createSongRow = function(songNumber, songName, songLength) {
     var template = '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';
     
     var $row = $(template);
     
     var clickHandler = function(e) {
         var songNumber = parseInt($(this).attr('data-song-number'));
         var songNamed = $(this).attr('data-song-name');
         if (currentlyPlayingSongNumber !== null){
             var prevSong = $('.song-item-number[data-song-number="'+currentlyPlayingSongNumber + '"]');
             prevSong.html(currentlyPlayingSongNumber);
         }    
         if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber); 
             currentSoundFile.play();
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber){
                if (currentSoundFile.isPaused()===true) {
                    currentSoundFile.play(); 
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                } else {
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);
                    currentSoundFile.pause();
                }
         }
    };
     
    var onHover = function(event) {
         var songNumberBox = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberBox.attr('data-song-number'));
         if (songNumber !== currentlyPlayingSongNumber){
             songNumberBox.html(playButtonTemplate);
         }
     };
     var offHover = function(event) {
         var songNumberBox = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberBox.attr('data-song-number'));
         if (songNumber !== currentlyPlayingSongNumber){
             songNumberBox.html(songNumber);
         }
     };
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
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

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}; 

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function(){
  var oldSongNumber = function(index) {
        return index == (currentAlbum.songs.length) ? 1 : index + 3;
    };
    var newSongI = trackIndex(currentAlbum, currentSongFromAlbum);
    newSongI++;
    
    if (newSongI >= currentAlbum.songs.length) {
        newSongI = 0;
    }
    
    setSong(newSongI);
    currentSoundFile.play();

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var oldSong = oldSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell('currentlyPlaying')
    var $oldSongNumberCell = getSongNumberCell(oldSong);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $oldSongNumberCell.html(oldSong);
};

var previousSong = function(){
  var oldSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    var newSongI = trackIndex(currentAlbum, currentSongFromAlbum);
    newSongI--;
    
    if (newSongI < 0) {
        newSongI = currentAlbum.songs.length - 1;
    }
    
    setSong(newSongI);
    currentSoundFile.play();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var oldSong = oldSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $oldSongNumberCell = getSongNumberCell(oldSong);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $oldSongNumberCell.html(oldSong);   

};

var setSong = function(songNumber){
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
};    

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="'+ number+'"]');
}

var playButtonTemplate = '<a class="album-song-button" id="play"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button" id="paused"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPersistance); 
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
   