// Part 1
// You have to fill these 3 variables, to get the data you need, you may open Network tab in inspect tools in your browser -> unfollow one person -> read the data from request
var xCsrfToken = "XXXXXXXXXXXXXXXXXXXXXXXXX";
var bearerToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var username = "XXXXXXXX";

// Part 2 - execute it before going to the "following" page - this script will get all userId for users that don't follow you. After executing scroll down to the bottom and go to step 3

var oldOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
   // when an XHR object is opened, add a listener for its load events
   this.addEventListener("load", onStateChange);
   // run the real `open`
   oldOpen.apply(this, arguments);
}

var usersToUnfollow = [];

function onStateChange(event) {
   var parsedData = JSON.parse(event.target.response).data;
   if (parsedData != undefined) {
      parsedData.user.result.timeline.timeline.instructions[0].entries.forEach(function (user) {
            if (user.content.itemContent != undefined && user.content.itemContent.user_results.result.legacy.followed_by == undefined) {
               usersToUnfollow.push(user.entryId.replace('user-', ''))
            }
         }
      })
}


// Part 3 - after we scroll to the bottom

async function unfollow(usersToUnfollow) {
   for (var [index, userId] of usersToUnfollow.entries()) {
      await delay(5000);
      await fetch("https://twitter.com/i/api/1.1/friendships/destroy.json", {
         "credentials": "include",
         "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.7,pl;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "x-client-uuid": "28fc2373-f5ef-44dc-9aad-3493bd261f5c",
            "x-twitter-auth-type": "OAuth2Session",
            "x-csrf-token": xCsrfToken,
            "x-twitter-client-language": "pl",
            "x-twitter-active-user": "yes",
            "X-Client-Transaction-Id": "mPd6VFVLrbXVqeLYCLHEVYxQ6hm+5JHjXCO/TzWO+/iudyM9sTwGizdN7YlGub9BX7NXA5gljeTN93YoNEvi9VwPDTfImQ",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "authorization": "Bearer " + bearerToken
         },
         "referrer": "https://twitter.com/" + username + "/following",
         "body": "include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&include_ext_profile_image_shape=1&skip_status=1&user_id=" + userId,
         "method": "POST",
         "mode": "cors"
      });
      await delay(getRandomInt(10) * 1000);
      console.log(`${index + 1} out of ${usersToUnfollow.length} has been unfollowed`);
      if (index === usersToUnfollow.length - 1) {
         alert('all non followers are unfollowed');
      }
   }
}

async function delay(time) {
   console.info('Waiting: ' + time / 1000 + ' seconds');
   return new Promise(resolve => setTimeout(resolve, time));
}

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
}

unfollow(usersToUnfollow);
