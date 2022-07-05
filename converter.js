function converter(youtubelink, audio_tag){
  fetch("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=" + encodeURIComponent(youtubelink)).then(response => {
    if (response.ok){
      var audio_streams = {};
      response.text().then(data => {

        var regex = /(?:ytplayer\.config\s*=\s*|ytInitialPlayerResponse\s?=\s?)(.+?)(?:;var|;\(function|\)?;\s*if|;\s*if|;\s*ytplayer\.|;\s*<\/script)/gmsu;

        data = data.split('window.getPageData')[0];
        data = data.replace('ytInitialPlayerResponse = null', '');
        data = data.replace('ytInitialPlayerResponse=window.ytInitialPlayerResponse', '');
        data = data.replace('ytplayer.config={args:{raw_player_response:ytInitialPlayerResponse}};', '');

        var matches = regex.exec(data);
        var data = matches && matches.length > 1 ? JSON.parse(matches[1]) : false;

        console.log(data);

        var streams = [],
          result = {};

        if (data.streamingData) {

          if (data.streamingData.adaptiveFormats) {
            streams = streams.concat(data.streamingData.adaptiveFormats);
          }

          if (data.streamingData.formats) {
            streams = streams.concat(data.streamingData.formats);
          }

        } else {
          return false;
        }

        streams.forEach(function(stream, n) {
          var itag = stream.itag * 1,
            quality = false;
          console.log(stream);
          switch (itag) {
            case 139:
              quality = "48kbps";
              break;
            case 140:
              quality = "128kbps";
              break;
            case 141:
              quality = "256kbps";
              break;
            case 249:
              quality = "webm_l";
              break;
            case 250:
              quality = "webm_m";
              break;
            case 251:
              quality = "webm_h";
              break;
          }
          if (quality) audio_streams[quality] = stream.url;
        });

        console.log(audio_streams);

        audio_tag.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
        audio_tag.play();
      })
    }
  });
}
