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
             updateSeekBarWhileSongPlays();
             
              var $volumeFill = $('.volume .fill');
              var $volumeThumb = $('.volume .thumb');
              $volumeFill.width(currentVolume + '%');
              $volumeThumb.css({left: currentVolume + '%'});
             
             updatePlayerBarSong();
             $(this).html(pauseButtonTemplate);
             
         } else if (currentlyPlayingSongNumber === songNumber){
                if (currentSoundFile.isPaused()===true) {
                    currentSoundFile.play(); 
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    updateSeekBarWhileSongPlays();
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

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;
         
         if ($(this).parent().attr('class') == 'seek-control'){
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio*100);
         }
         updateSeekPercentage($(this), seekBarFillRatio);
     });
     
     $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();
 
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control'){
                 seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                 setVolume(seekBarFillRatio);
             }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
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
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastPlayedSong = oldSongNumber(currentSongIndex);
    var $nextSongCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastPlayedSongCell = $('.song-item-number[data-song-number="' + lastPlayedSong + '"]');
   
    $nextSongCell.html(pauseButtonTemplate);
    $lastPlayedSongCell.html(lastPlayedSong);
    
};

var previousSong = function(){
    var oldSongNumber = function(index) {
        return index == currentAlbum.songs.length ? 0 : index+2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length-1;
    }
    setSong(currentSongIndex+1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastPlayedSong = oldSongNumber(currentSongIndex);
    var $nextSongCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastPlayedSongCell = $('.song-item-number[data-song-number="' + lastPlayedSong + '"]');
   
    $nextSongCell.html(pauseButtonTemplate);
    $lastPlayedSongCell.html(lastPlayedSong);

};

var togglePlayFromPlayerBar = function(){
  if (currentSoundFile.isPaused()){
      currentSoundFile.play();
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
      $playPauseButton.html(pauseButtonTemplate);
  }
  else {
      currentSoundFile.pause();
      getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
      $playPauseButton.html(playButtonTemplate);
  }
};

var setSong = function(songNumber){
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    console.log('cpsn: ', currentlyPlayingSongNumber);
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1];
    console.log('csfa: ',currentSongFromAlbum);
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
}; 

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

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

var $playPauseButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPersistance); 
    setupSeekBars();
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
    $previousButton.click(previousSong);
});
   