import * as $ from 'jquery';
import { FacebookService, InitParams } from 'ngx-facebook';

export function initFacebook(api: string) {
    const FB = new FacebookService();
    const initParams: InitParams = {
        appId: api,
        xfbml: true,
        version: 'v2.10'
    };
    FB.init(initParams);
    return FB;
}

export function sendToFacebook(FB, blob) {
    FB.getLoginStatus()
        .then(function (loginStatusResponse) {
            if (loginStatusResponse.status === 'connected') {
                console.log('connnected');
                postImageToFacebook(FB, loginStatusResponse.authResponse.accessToken,
                    'Canvas to Facebook', 'image/png', blob, window.location.href);
            } else {
                FB.login({ scope: 'publish_actions' })
                    .then(function (loginResponse) {
                        if (loginResponse.status === 'connected') {
                            console.log('connnected');
                            postImageToFacebook(FB, loginResponse.authResponse.accessToken,
                                'Canvas to Facebook', 'image/png', blob, window.location.href);
                        } else if (loginResponse.status === 'not_authorized') {
                            console.log('not authorized');
                        } else {
                            console.log('not logged into facebook');
                        }
                    })
                    .catch(function (loginResponse) {
                        console.log(loginResponse);
                    });
                console.log('not authorized');
            }
        }).catch(function (loginStatusResponse) {
            console.log(loginStatusResponse);
        });
}

function postImageToFacebook(FB, token, filename, mimeType, imageData, message) {
    $('.loading').css('visibility', 'visible');
    const fd = new FormData();
    fd.append('access_token', token);
    fd.append('source', imageData);
    fd.append('no_story', 'true');

    // Upload image to facebook without story(post to feed)
    $.ajax({
      url: 'https://graph.facebook.com/me/photos?access_token=' + token,
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      cache: false,
      success: (data) => {
        console.log('success: ', data);
        FB.ui({
            method: 'feed',
            link: 'https://www.facebook.com/photo.php?fbid=' + data.id,
            caption: 'carte canimap'
        });
      },
      error: function (shr, status, data) {
        console.log('error ' + data + ' Status ' + shr.status);
      },
      complete: function (data) {
        console.log('Post to facebook Complete');
        $('.loading').css('visibility', 'hidden');
    }
    });
  }
