# cURLing

## Challenge Information
- **Difficulty**: 1 / 5
- **Description**: Team up with Bow Ninecandle to send web requests from the command line using Curl, learning how to interact directly with web servers and retrieve information like a pro!

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [Dialog](#dialog)
2. [Solution: Silver](#solution-silver)
3. [Solution: Gold](#solution-gold)

## Dialog
Bow Ninecandle:
```
> Well hello there! I'm Bow Ninecandle, bright as a twinkling star! Everyone's busy unpacking, but I've grown quite bored of that. Care to join me for a lovely game?
> Oh Joy! Today, We're diving into something delightful: the curling challenge—without any ice, but plenty of sparkle!
> No icy brooms here though! We're all about Curl, sending web requests from the command line like magic messages.
> So, have you ever wielded Curl before? If not, no worries at all, my friend!
> It's this clever little tool that lets you whisper directly to web servers. Pretty neat, right?
> Think of it like sending secret scrolls through the interwebs, awaiting a wise reply!
> To begin, you can type something like curl https://example.com. Voilà! The HTML of the page appears, like conjuring a spell!
> Simple enough, huh? But oh, there's a whole world of magic you can cast with Curl!
> We're just brushing the surface here, but trust me—it’s a hoot and a half!
> If you get tangled up or need help, just give me a shout! I’m here to help you ace this curling spectacle.
> So, are you ready to curl those web requests like a pro? Let’s see your magic unfold!
```

## Solution: Silver

### Assignment 1
**Description**: Unlike the defined standards of a curling sheet, embedded devices often have web servers on non-standard ports.  Use curl to retrieve the web page on host "curlingfun" port 8080.
If you need help, run the 'hint' command.

**Solution**: Use the `curl` command to retrieve the webpage hosted on "curlingfun" at port 8080.

**Command to run**:
```
curl http:/curlingfun:8080
```

**Response**:
```
You have successfully accessed the site on port 8080!

If you need help, please remember to run "hint" for a hint!
```

### Assignment 2
**Description**: Embedded devices often use self-signed certificates, where your browser will not trust the certificate presented.  Use curl to retrieve the TLS-protected web page at https://curlingfun:9090/

**Solution**: Embedded devices often use self-signed certificates, which are not trusted by browsers. To bypass this issue, `curl` provides the `--insecure` flag, allowing you to retrieve TLS-protected web pages even when the certificate cannot be verified.

**Command to run**:
```
curl --insecure https://curlingfun:9090
```

**Response**:
```
You have successfully bypassed the self-signed certificate warning!
Subsequent requests will continue to require "--insecure", or "-k" for short.

If you need help, please remember to run "hint" for a hint!
```

### Assignment 3
**Description**: Working with APIs and embedded devices often requires making HTTP POST requests. Use curl to send a request to https://curlingfun:9090/ with the parameter "skip" set to the value "alabaster", declaring Alabaster as the team captain.

**Solution**: To solve the task, use the `curl` command to send an HTTP POST request. Reference the manual for the `-X POST` flag (to specify the request method) and the `-d` option (to include data in the request).

**Command to run**:
```
curl --insecure https://curlingfun:9090 -X POST -d "skip=alabaster"
```

**Response**:
```
You have successfully made a POST request!
```

### Assignment 4
**Description**: Working with APIs and embedded devices often requires maintaining session state by passing a cookie.  Use curl to send a request to https://curlingfun:9090/ with a cookie called "end" with the value "3", indicating we're on the third end of the curling match.

**Solution**: To complete this task, use the `--cookie` option in `curl` to include a cookie named `end` with the value `3`. This simulates maintaining session state, as described in the challenge.

**Command to run**:
```
curl --insecure --cookie "end=3" https://curlingfun:9090/
```

**Response**:
```
You have successfully set a cookie!
```

### Assignment 5
**Description**: Working with APIs and embedded devices sometimes requires working with raw HTTP headers.  Use curl to view the HTTP headers returned by a request to https://curlingfun:9090/

**Solution**: To complete this task, use the `--head` option in `curl` to retrieve only the HTTP headers from the specified URL. Since the server uses HTTPS with a potentially invalid certificate, include the `--insecure` flag to bypass certificate verification.

**Command to run**:
```
curl --insecure --head https://curlingfun:9090/
```

**Response**:
```
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 30 Dec 2024 16:07:37 GMT
Content-Type: text/plain;charset=UTF-8
Connection: keep-alive
Custom-Header: You have found the custom header!
```

### Assignment 6
**Description**: Working with APIs and embedded devices sometimes requires working with custom HTTP headers.  Use curl to send a request to https://curlingfun:9090/ with an HTTP header called "Stone" and the value "Granite".

**Solution**: Working with APIs and embedded devices sometimes requires custom HTTP headers. Use `curl` to send a request to `https://curlingfun:9090/` with an HTTP header called `Stone` and the value `Granite`.

**Command to run**:
```
curl --insecure --header "Stone: Granite" https://curlingfun:9090/
```

**Response**:
```
You have successfully set a custom HTTP header!
```

### Assignment 7
**Description**: curl will modify your URL unless you tell it not to.  For example, use curl to retrieve the following URL containing special characters: https://curlingfun:9090/../../etc/hacks

**Solution**: Curl will modify your URL unless you tell it not to. Use curl to retrieve the following URL containing special characters: `https://curlingfun:9090/../../etc/hacks`
Use the `--insecure` flag to allow insecure connections and `--path-as-is` to prevent curl from altering the URL.

**Command to run**:
```
curl --insecure --path-as-is "https://curlingfun:9090/../../etc/hacks"
```

**Response**:
```
You have successfully utilized --path-as-is to send a raw path!
```

## Solution: Gold
On the machine, there is a file named "HARD-MODE.txt," which describes how to achieve gold. The contents of the file are as follows:

```
Prefer to skip ahead without guidance?  Use curl to craft a request meeting these requirements:

- HTTP POST request to https://curlingfun:9090/
- Parameter "skip" set to "bow"
- Cookie "end" set to "10"
- Header "Hack" set to "12ft"
```

The file describes that we need to use curl with a set of requirements.
These requirements can be combined into the following curl command:
```
curl --insecure https://curlingfun:9090/ -X POST -d "skip=bow" --cookie "end=10" --header "Hack: 12ft"
```

When you run the command, you get the following response:
```
Excellent!  Now, use curl to access this URL: https://curlingfun:9090/../../etc/button
```

We now modify our original command to match the message we just received. The updated command will look like this:
```
curl --insecure https://curlingfun:9090/../../etc/button -X POST -d "skip=bow" --cookie "end=10" --header "Hack: 12ft" --path-as-is
```

When you run the command, you get the following response:
```
Great!  Finally, use curl to access the page that this URL redirects to: https://curlingfun:9090/GoodSportsmanship
```

We now adjust the command as follows:
```
curl --insecure https://curlingfun:9090/GoodSportsmanship -X POST -d "skip=bow" --cookie "end=10" --header "Hack: 12ft" --path-as-is -L
```

When you run the command, you get the following response,  and the challenge is registered as solved.
```
Excellent work, you have solved hard mode!  You may close this terminal once HHC grants your achievement.
```