import querystring from 'querystring';

export const getTweets = async (id) => {

  const queryParams = querystring.stringify({
    expansions:
      'author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id',
    'tweet.fields':
      'attachments,author_id,public_metrics,created_at,id,in_reply_to_user_id,referenced_tweets,text,entities',
    'user.fields': 'id,name,profile_image_url,protected,url,username,verified',
    'media.fields':
      'duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics'
  });

  const response = await fetch(
    `https://api.twitter.com/2/tweets/${id}?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_AUTH_TOKEN}`
      }
    }
  );

  const tweet = await response.json();

  //console.log(JSON.stringify(tweet, null, 4));

  const getAuthorInfo = (author_id) => {
    return tweet.includes.users.find((user) => user.id === author_id);
  };

  const getReferencedTweets = (mainTweet) => {
    return (
      mainTweet?.referenced_tweets?.map((referencedTweet) => {
        const fullReferencedTweet = tweet.includes.tweets.find(
          (tweet) => tweet.id === referencedTweet.id
        );

        return {
          type: referencedTweet.type,
          author: getAuthorInfo(fullReferencedTweet.author_id),
          ...fullReferencedTweet
        };
      }) || []
    );
  };

  const getExternalUrls = (tweet) => {
    const externalURLs = tweet.entities?.urls
    const mappings = {}
    if (externalURLs) {
        externalURLs.map((url) => {
            mappings[`${url.url}`] = !url.display_url.startsWith("pic.twitter.com") && !url.display_url.startsWith("twitter.com") ? url.expanded_url : ""
        })
    }
    var processedText = tweet.text
    Object.entries(mappings).map(([k, v], i) => {
        processedText = processedText.replace(k, v)
    })
    return processedText
  }

  tweet.data.text = getExternalUrls(tweet.data)
  tweet?.includes?.tweets?.map((twt) => {
    twt.text = getExternalUrls(twt)
  })

  return {
    ...tweet.data,
    media:
        tweet.data?.attachments?.media_keys.map((key) =>
        tweet.includes.media.find((media) => media.media_key === key)
      ) || [],
    referenced_tweets: getReferencedTweets(tweet.data),
    author: getAuthorInfo(tweet.data.author_id)
  };
};