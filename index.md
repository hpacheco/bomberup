---
layout: default
---

# Setup :cd:

Configure and run a custom docker-based instance of bomberup:

```
sudo docker run -ti --init --rm -p 3001:3000 -v ${PWD}/db:/bomberup/db hugopacheco/bomberup
```

Open the locally-hosted website (http://localhost:3001) with your web browser.

## FAQ :scroll:

* The website will store player and match data in a `db` folder inside the docker container. The `-v` parameter above will create and store such folder in host machine, to avoid such state to be resetted on each docker launch.
* To reset the site's state, remove the `db` folder.
 
# Demo :bomb:

1. Play the game in the start page against a computer.
2. Create an account and login.
3. Go through the bot tutorials.
4. Try to develop your own bot to play against other bots.
