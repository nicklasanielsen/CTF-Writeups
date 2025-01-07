# Microsoft KC7

## Challenge Information
- **Difficulty**: 3 / 5
- **Description**: Answer two sections for silver, all four sections for gold.

> [!NOTE]
> Answer two sections for silver, all four sections for gold.

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [KQL 101](#kql-101)
    - [Subchallenge Information](#subchallenge-information)
2. [Operation Surrender](#operation-surrender)
    - [Subchallenge Information](#subchallenge-information-1)
3. [Operation Snowfall](#operation-snowfall)
    - [Subchallenge Information](#subchallenge-information-2)
4. [Echoes in the Frost](#echoes-in-the-frost)
    - [Subchallenge Information](#subchallenge-information-3)

## Dialog
Pepper Minstix:
```
> This is weird, I got some intel about an imminent attack.
> Pepper Minstix here! I’ve got urgent news from neutral ground.
> The North Pole is facing a serious cyber threat, and it’s putting all the factions on edge. The culprits? Some troublemakers from Team Wombley.
> They’ve launched a barrage of phishing attacks, ransomware, and even some sneaky espionage, causing quite the stir.
> It’s time to jump into action and get cracking on this investigation—there’s plenty of cyber-sleuthing to do.
> You’ll be digging into KQL logs, tracking down phishing schemes, and tracing compromised accounts like a seasoned pro.
> Malware infections have already breached Alabaster Snowball’s systems, so we need swift action.
> Your top mission: neutralize these threats, with a focus on the ransomware wreaking havoc from Team Wombley.
> It’s a hefty challenge, but I know you’re up to it. We need your expertise to restore order and keep the peace.
> You’ve got the tools, the skills, and the know-how—let’s show Team Wombley we mean business.
> Ready to dive in? Let's defend the North Pole and bring back the holiday harmony!
```

Wunorse Openslae:
```
> Hey, Wunorse here. We at Team Wombley pulled off some nasty stuff. 
> Phishing attacks, ransomware, and cyber espionage, oh yeah!
> We pulled loads of all-nighters to make it all happen. Energy drinks rock!
> Our teams did what Alabaster said we never could and breached Santa's network. We're so rad.
> It would take a master defender to fix all the damage we caused. But defense is so lame! Offense is where it's at.
> You should just leave them to panic and join our side. We're the coolest, don't you want to be like us?
```

## KQL 101

## Subchallenge Information
- **Difficulty**: 3 / 5
- **Description**: Learn and practice basic KQL queries to analyze data logs for North Pole operations.

## Question 1

### Introduction

```
Welcome to your mission to solve the The Great Elf Conflict! To do so, you'll need to harness the power of KQL (Kusto Query Language) to navigate through the data and uncover crucial evidence.

Your next step is to meet with Eve Snowshoes, Cyber Engineer, at the at the North Pole Cyber Defense Unit. Eve is known for unmatched expertise in KQL and has been eagerly awaiting your arrival. 
```

![](images/eve_snowshoes.png)

```
Eve greets you with a nod and gestures toward the terminal. "KQL is like a key, unlocking the hidden secrets buried within the data."

Type `let’s do this` to begin your KQL training.
```

### Solution

I simply copy the answer from
the introduction.

Answer: let's do this

## Question 2

### Introduction

```
The first command Eve Snowshoes teaches you is one of the most useful in querying data with KQL. It helps you peek inside each table, which is critical for understanding the structure and the kind of information you're dealing with. By knowing what's in each table, you’ll be able to create more precise queries and uncover exactly what you need.

Employees
| take 10 

Eve has shared the first table with you. Now, run a take 10 on all the other tables to see what they contain.

You can find the tables you have access to at the top of the ADX query window.

Once you've examined all the tables, type `when in doubt take 10` to proceed.
```

### Solution

I start by examining the different tables as indicated in the introduction.

![](images/Available%20Tables.png)

![](images/Top%2010%20Emp.png)

After looking around a bit, I provide the answer given in the introduction.

Answer: `when in doubt take 10`

## Question 3

### Introduction

```
Now, let’s gather more intelligence on the employees. To do this, we can use the count operator to quickly calculate the number of rows in a table. This is helpful for understanding the scale of the data you’re working with.

Employees
| count 

How many elves did you find?
```

### Solution
I execute the query specified in the introduction. The query returns 90.

Answer: `90`

## Question 4

### Introduction

```
You can use the where operator with the Employees table to locate a specific elf. Here’s a template you can follow:

Employees
| where <field><operator><value>

Field: The column you want to filter by (e.g., role).

Operator: The condition you’re applying (e.g., == for an exact match).

Value: The specific value you’re looking for in the field (e.g., Chief Elf Officer).

Can you find out the name of the Chief Toy Maker?
```

### Solution
I am asked to find the name of the Chief Toy Maker.
I search for it using role with the following query:

```
Employees
| where role == "Chief Toy Maker"
```

The query returns a data row. The name of the `Chief Toy Maker` is `Shinny Upatree`, which I retrieved from the name column.

Answer: `Shinny Upatree`

## Question 5

### Introduction

```
Here are some additional operators the North Pole Cyber Defense Unit commonly uses.

== : Checks if two values are exactly the same. Case-sensitive.

contains : Checks if a string appears anywhere, even as part of a word. Not case-sensitive.

has : Checks if a string is a whole word. Not case-sensitive.

has_any : Checks if any of the specified words are present. Not case-sensitive.

in : Checks if a value matches any item in a list. Case-sensitive.

Type operator to continue.
```

### Solution
This is simply information about different operators.
I submit `operator` as the answer, as provided in the introduction.

Answer: `operator`

## Question 6

### Introduction

```
We can learn more about an elf by cross-referencing information from other tables. Let’s take a look at Angel Candysalt’s correspondence. First, retrieve her email address from the Employees table, and then use it in a query in the Email table.

Email
| where recipient == "<insert Angel Candysalt’s email address here>"
| count

How many emails did Angel Candysalt receive?
```

### Solution
I first find Angel Candysalt's email. I do this by executing the following query on the Employees table:
```
Employees
| where name == "Angel Candysalt"
```

The query returns a column that shows the email address: `angel_candysalt@santaworkshopgeeseislands.org`.

I then take the query from the introduction and provide the email.

```
Email
| where recipient == "angel_candysalt@santaworkshopgeeseislands.org"
| count
```

The query returns `31` which indicates that Angel Candysalt received 31 emails.

Anwser: `31`

## Question 7

### Introduction

```
You can use the distinct operator to filter for unique values in a specific column.

Here's a start:

Email
| where sender has "<insert domain name here>"
| distinct <field you need>
| count

How many distinct recipients were seen in the email logs from twinkle_frostington@santaworkshopgeeseislands.org?
```

### Solution
I take the query from the introduction and insert the email address.

```
Email
| where sender has "twinkle_frostington@santaworkshopgeeseislands.org"
| distinct recipient
| count
```

The query returns `32` which indicates there are 32 distinct recipients.

Answer: `32`

## Question 8

### Introduction

```
It’s time to put everything we’ve learned into action!

OutboundNetworkEvents
| where src_ip == "<insert IP here>"
| <operator> <field>
| <operator>

How many distinct websites did Twinkle Frostington visit?
```

### Solution
I start by finding the IP address associated with Twinkle Frostington. I do this by querying the Employees table as shown below:

```
Employees
| where name == "Twinkle Frostington"
| distinct ip_addr
```
The query tells me that the IP address is `10.10.0.36`.

I then take the IP address and insert it into the query from the introduction. I provide the final operators as indicated below.

```
OutboundNetworkEvents
| where src_ip == "10.10.0.36"
| distinct url
| count
```

The query returns `4` which indicates Twinkle Frostington visited 4 distinct websites.

Answer: `4`

## Question 9

### Introduction

```
How many distinct domains in the PassiveDns records contain the word green?

PassiveDns
| where <field> contains “<value>”
| <operator> <field>
| <operator>

You may have notice we’re using contains instead of has here. That’s because has will look for an exact match (the word on its own), while contains will look for the specified sequence of letters, regardless of what comes before or after it. You can try both on your query to see the difference!
```

### Solution
As with the previous tasks, I take the query from the introduction and provide the different values based on the task.

```
PassiveDns
| where domain contains "green"
| distinct domain
| count
```

The query returns `10` which indicates 10 domains contained the word green.

Answer: `10`

## Question 10

### Introduction

```
Sometimes, you’ll need to investigate multiple elves at once. Typing each one manually or searching for them one by one isn’t practical. That’s where let statements come in handy. A let statement allows you to save values into a variable, which you can then easily access in your query.

Let’s look at an example. To find the URLs they accessed, we’ll first need their IP addresses. But there are so many Twinkles! So we’ll save the IP addresses in a let statement, like this:

let twinkle_ips =
Employees
| where name has "<the name we’re looking for>"
| distinct ip_addr;

This saves the result of the query into a variable. Now, you can use that result easily in another query:

OutboundNetworkEvents  
| where src_ip in (twinkle_ips)  
| distinct <field>

How many distinct URLs did elves with the first name Twinkle visit?
```

### Solution
Once again, I take the template from the introduction and provide the final information based on the description in the introduction.

```
let twinkle_ips =
Employees
| where name has "Twinkle"
| distinct ip_addr;
OutboundNetworkEvents  
| where src_ip in (twinkle_ips)  
| distinct url
| count
```

Søgningen returnerer 8 som jeg angiver som svar
The query returns `8` which indicates 8 URLs distinct was visited.

Answer: `8`

> [!NOTE]
> The answer must also be submitted under `objectives`

## Operation Surrender

## Subchallenge Information
- **Difficulty**: 3 / 5
- **Description**: Investigate a phishing attack targeting Wombley’s team, uncovering espionage activities.

## Question 1

### Introduction

```
Eve Snowshoes approaches with a focused expression. "Welcome to Operation Surrender: Alabaster's Espionage. In this phase, Team Alabaster has executed a covert operation, and your mission is to unravel their tactics. You'll need to piece together the clues and analyze the data to understand how they gained an advantage."

Type `surrender` to get started!
```

### Solution
I submit surrender as the answer, as indicated in the introduction.

Answe: `surrender`

## Question 2

### Introduction

```
Team Alabaster, with their limited resources, was growing desperate for an edge over Team Wombley. Knowing that a direct attack would be costly and difficult, they turned to espionage. Their plan? A carefully crafted phishing email that appeared harmless but was designed to deceive Team Wombley into downloading a malicious file. The email contained a deceptive message with the keyword “surrender” urging Wombley’s members to click on a link.
```

![](images/Phishy.png)

```
Now, it's up to you to trace the origins of this operation.

Who was the sender of the phishing email that set this plan into motion?

Try checking out the email table using the knowledge you gained in the previous section!
```

### Solution
I perform a search looking for emails where the subject contains `surrender`, as hinted in the introduction.

```
Email
| where subject contains "surrender"
| distinct sender
```

The search returns `surrender@northpolemail.com` as the only email.

Answer: `surrender@northpolemail.com`

## Question 3

### Introduction

```
Team Alabaster’s phishing attack wasn’t just aimed at a single target—it was a coordinated assault on all of Team Wombley. Every member received the cleverly disguised email, enticing them to click the malicious link that would compromise their systems.

Hint: the distinct operator would help here Your mission is to determine the full scale of this operation.

How many elves from Team Wombley received the phishing email?
```

### Solution
Now that I know the email address, I perform the following query. The query finds all emails sent from the malicious email address and counts how many different recipients there are.

```
Email
| where sender == "surrender@northpolemail.com"
| distinct recipient
| count
```

The query returned the number `22`.

Answer: `22`

## Question 4

### Introduction
```
The phishing email from Team Alabaster included a link to a file that appeared legitimate to Team Wombley. This document, disguised as an important communication, was part of a carefully orchestrated plan to deceive Wombley’s members into taking the bait.

To understand the full extent of this operation, we need to identify the file where the link led to in the email.

What was the filename of the document that Team Alabaster distributed in their phishing email?
```

### Solution
I perform a search for emails with the malicious email address as the sender and look in the link column.

```
Email
| where sender == "surrender@northpolemail.com"
| distinct link
```

From the search result, I see that the file is named `Team_Wombley_Surrender.doc`.

Answer: `Team_Wombley_Surrender.doc`

## Question 5

### Introduction
```
As the phishing emails landed in the inboxes of Team Wombley, one elf was the first to click the URL, unknowingly triggering the start of Team Alabaster’s plan. By connecting the employees to their network activity, we can trace who fell for the deception first. To find the answer, you'll need to join two tables: Employees and OutboundNetworkEvents. The goal is to match employees with the outbound network events they initiated by using their IP addresses.

Here’s an example query to help you:

Employees
| join kind=inner (
    OutboundNetworkEvents
) on $left.ip_addr == $right.src_ip // condition to match rows
| where url contains "< maybe a filename :) >"
| project name, ip_addr, url, timestamp // project returns only the information you select
| sort by timestamp asc //sorts time ascending

This query will give you a list of employees who clicked on the phishing URL. The first person to click will be at the top of the list!

Who was the first person from Team Wombley to click the URL in the phishing email?
```

### Solution
I use the template provided in the introduction to perform a join between the `OutboundNetworkEvents` and `Employees` tables, where `ip_addr` and `src_ip` are the linking elements.

```
Employees
| join kind=inner (
    OutboundNetworkEvents
) on $left.ip_addr == $right.src_ip
| where url has "Team_Wombley_Surrender.doc"
| project name, ip_addr, url, timestamp
| sort by timestamp asc
```

The query returns an overview of which elves have received and clicked on the phishing link.
Based on the returned data, the first elf to click the phishing link was `Joyelle Tinseltoe`.

Answer: `Joyelle Tinseltoe`

## Question 6

### Introduction
```
Once the phishing email was clicked and the malicious document was downloaded, another file was created upon execution of the .doc. This file allowed Team Alabaster to gain further insight into Team Wombley’s operations. To uncover this, you’ll need to investigate the processes that were executed on Joyelle Tinseltoe’s machine.

Your mission is to determine the name of the file that was created after the .doc was executed.

Focus on Joyelle Tinseltoe’s hostname and explore the ProcessEvents table. This table tracks which processes were started and by which machines. By filtering for Joyelle’s hostname and looking at the timestamps around the time the file was executed, you should find what you’re looking for. Here’s an example to help guide you:

ProcessEvents
| where timestamp between(datetime("2024-11-25T09:00:37Z") .. datetime("2024-11-26T17:20:37Z")) //you’ll need to modify this
| where hostname == "<Joyelle's hostname>"

This query will show processes that ran on Joyelle Tinseltoe’s machine within the given timeframe.

What was the filename that was created after the .doc was downloaded and executed?
```

### Solution
Based on the query from the previous question, I find that the timestamp when the file was retrieved is `2024-11-27T14:11:45Z`.

Next, I find the hostname for Joyelle's machine by looking it up in the Employees table.

```
Employees
| where name has "Joyelle Tinseltoe"
| distinct hostname
```

The query tells me that the hostname is `Elf-Lap-W-Tinseltoe`, and the username is `jotinseltoe`.

With this information, I can now take the search from the introduction to find out which file was created.

```
ProcessEvents
| where timestamp between(datetime("2024-11-27T14:00:00Z") .. datetime("2024-11-27T15:00:00Z"))
| where hostname has "Elf-Lap-W-Tinseltoe"
| where username has "jotinseltoe"
```

The query returns 2 log entries, as shown below:

|timestamp|parent_process_name|parent_process_hash|process_commandline|process_name|process_hash|hostname|username|
|-|-|-|-|-|-|-|-|
|2024-11-27T14:12:44Z|Explorer.exe|9d8a7d433af5d645e06f6da852d0d593a750416675aff21d3d42f3243e9de1b5|Explorer.exe "C:\Users\jotinseltoe\Downloads\Team_Wombley_Surrender.doc"|Explorer.exe|8984d7b9a5b33f56d4a3b1e2e140c9a8d19f037a252b7ffc8038e76557a963b5|Elf-Lap-W-Tinseltoe|jotinseltoe|
|2024-11-27T14:12:45Z|Explorer.exe|a39ac00c7890ac93af341dafe839265b040d443691ea39268afb198a6f9b0269|C:\Users\Public\AppData\Roaming\keylogger.exe|keylogger.exe|e7e7c6d6a4b5d67a90556b50e45734c8221dbf89f47913d82bd04b47162e141a|Elf-Lap-W-Tinseltoe|jotinseltoe|

Based on the logs above, I can see that the file is named `keylogger.exe`.

Answer: `keylogger.exe`

## Question 7

### Introduction

```
Well done on piecing together the clues and unraveling the operation!
```

![](images/congrats_christmas_tree.png)

```
Team Alabaster's phishing email, sent from surrender@northpolemail.com, targeted 22 elves from Team Wombley. The email contained a malicious document named Team_Wombley_Surrender.doc, which led to the first click by Joyelle Tinseltoe.

After the document was downloaded and executed, a malicious file was created, impacting the entire Team Wombley as it ran on all their machines, giving Team Alabaster access to their keystokes!

To obtain your flag use the KQL below with your last answer!

let flag = "Change This!";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded
```

### Solution
Based on the previous tasks and the template from the introduction, I create the following query:

```
let flag = "keylogger.exe";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded
```

The query returns the Base64 value `a2V5bG9nZ2VyLmV4ZQ==`.

Answer: `a2V5bG9nZ2VyLmV4ZQ==`

> [!NOTE]
> The answer must also be submitted under `objectives`

## Operation Snowfall

## Subchallenge Information
- **Difficulty**: 3 / 5
- **Description**: Track and analyze the impacts of a ransomware attack initiated by Wombley’s faction.

## Question 1

### Introduction

```
"Fantastic work on completing Section 2!" Eve Snowshoes, Senior Security Analyst, says with a proud smile.

"You’ve demonstrated sharp investigative skills, uncovering every detail of Team Wombley’s attack on Alabaster. Your ability to navigate the complexities of cyber warfare has been impressive.

But now, we embark on Operation Snowfall: Team Wombley’s Ransomware Raid. This time, the difficulty will increase as we dive into more sophisticated attacks. Stay sharp, and let’s see if you can rise to the occasion once again!"
```

![](images/snowfall.png)

```
Type `snowfall` to begin
```

### Solution
I submit `snowfall` as the answer, as indicated in the introduction.

Answer: `snowfall`

## Question 2

### Introduction
```
Team Wombley’s assault began with a password spray attack, targeting several accounts within Team Alabaster. This attack relied on repeated login attempts using common passwords, hoping to find weak entry points. The key to uncovering this tactic is identifying the source of the attack. 
```

![](images/Fall2024!.png)

```
Authentication events can be found in the AuthenticationEvents table. Look for a pattern of failed login attempts.

Here’s a query to guide you:

AuthenticationEvents
| where result == "Failed Login"
| summarize FailedAttempts = count() by username, src_ip, result
| where FailedAttempts >= 5
| sort by FailedAttempts desc

What was the IP address associated with the password spray?
```

### Solution
I take the query from the introduction and modify it so that it only looks for IP addresses.

```
AuthenticationEvents
| where result == "Failed Login"
| summarize FailedAttempts = count() by src_ip
```

The query shows that the IP address `59.171.58.12` has failed to log in `4419 times`, which is significantly higher compared to the second place, which has `288` failed attempts.

Answer: `59.171.58.12`

## Question 3

### Introduction

```
After launching the password spray attack, Team Wombley potentially had success and logged into several accounts, gaining access to sensitive systems.

Eve Snowshoes weighs in: "This is where things start to get dangerous. The number of compromised accounts will show us just how far they’ve infiltrated."
```

![](images/successful_signin.png)

```
How many unique accounts were impacted where there was a successful login from 59.171.58.12?
```

### Solution
Now that I know the malicious IP address, I search for it and look for logs where the login was successful.

```
AuthenticationEvents
| where result has "Successful Login"
| where has_ipv4(src_ip, "59.171.58.12")
| distinct username
| count
```

The query tells me that 23 user accounts have been affected by successful logins from the malicious IP address.

Answer: `23`

## Question 4

### Introduction
```
In order to login to the compromised accounts, Team Wombley leveraged a service that was accessible externally to gain control over Alabaster’s devices.
```

![](images/remote_service_exploited.png)

```
Eve Snowshoes remarks, "Identifying the service that was open externally is critical. It shows us how the attackers were able to bypass defenses and access the network. This is a common weak point in many systems."

What service was used to access these accounts/devices?
```

### Solution
I start by adjusting the previous query to explore what other information the logs can reveal.

```
AuthenticationEvents
| where has_ipv4(src_ip, "59.171.58.12")
| where result has "Successful Login"
```

I review several logs, and they all appear similar to the following. It seems that the RDP service has been compromised.

```
"timestamp": 2024-12-10T21:39:27Z,
"hostname": Elf-Lap-A-Ribbonson,
"src_ip": 59.171.58.12,
"user_agent": Mozilla/5.0 (U; Linux i651 x86_64; en-US) Gecko/20100101 Firefox/57.5,
"username": frribbonson,
"result": Successful Login,
"password_hash": cb65bddf74f54756c88b77624defdd88,
"description": User successfully logged onto Elf-Lap-A-Ribbonson via RDP.
```

To confirm this assumption, I expand my search to include the `description` field.

```
AuthenticationEvents
| where has_ipv4(src_ip, "59.171.58.12")
| where result has "Successful Login"
| parse description with "User successfully logged onto " DestinationService " via " SourceService "."
| distinct SourceService
```

The search only returns `RDP`, which confirms the compromised service.

Answer: `RDP`

## Question 5

### Introduction
```
Once Team Wombley gained access to Alabaster's system, they targeted sensitive files for exfiltration. Eve Snowshoes emphasizes, "When critical files are exfiltrated, it can lead to devastating consequences. Knowing exactly what was taken will allow us to assess the damage and prepare a response."

The ProcessEvents table will help you track activities that occurred on Alabaster’s laptop. By narrowing down the events by timestamp and hostname, you’ll be able to pinpoint the file that was exfiltrated.

What file was exfiltrated from Alabaster’s laptop?
```

### Solution
I start by finding the username and hostname for Alabaster by querying the Employees table.

```
Employees
| where name has "Alabaster"
```

The query returns the following informaiton:
- Username: `alsnowball`
- Hostname: `Elf-Lap-A-Snowball`

With the information from the previous step, I now search for a process log related to the username and hostname.

```
ProcessEvents
| where hostname has "Elf-Lap-A-Snowball"
| where username has "alsnowball"
```

Upon reviewing the 21 logs returned by the query, I notice several logs mentioning `Secret_Files.zip`.

Answer: `Secret_Files.zip`


## Question 6

### Introduction
```
After exfiltrating critical files from Alabaster’s system, Team Wombley deployed a malicious payload to encrypt the device, leaving Alabaster locked out and in disarray.

Eve Snowshoes comments, "The final blow in this attack was the ransomware they unleashed. Finding the name of the malicious file will help us figure out how they crippled the system."

What is the name of the malicious file that was run on Alabaster's laptop?
```

### Solution
While reviewing the logs from the previous step, I come across `EncryptEverything.exe`.

Answer: `EncryptEverything.exe`

## Question 7

### Introduction
```
Outstanding work! You've successfully pieced together the full scope of Team Wombley’s attack. Your investigative skills are truly impressive, and you've uncovered every critical detail.

Just to recap: Team Wombley launched a cyber assault on Alabaster, beginning with a password spray attack that allowed them to gain access to several accounts. Using an external service over RDP, they infiltrated Alabaster’s system, exfiltrating sensitive files including the blueprints for snowball cannons and drones. To further their attack, Wombley executed a malicious file, which encrypted Alabaster’s entire system leaving them locked out and in chaos.

To obtain your flag use the KQL below with your last answer!

let flag = "Change This!";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded

Enter your flag to continue
```

### Solution
I take the template from the introduction and modify the value for flag to EncryptEverything.exe, which was the answer from the previous task.

```
let flag = "EncryptEverything.exe";
let base64_encoded = base64_encode_tostring(flag);
print base64_encoded
```

The query returns the Base64 value `RW5jcnlwdEV2ZXJ5dGhpbmcuZXhl`.

Answer: `RW5jcnlwdEV2ZXJ5dGhpbmcuZXhl`

> [!NOTE]
> The answer must also be submitted under `objectives`

## Echoes in the Frost

## Subchallenge Information
- **Difficulty**: 3 / 5
- **Description**: Use logs to trace an unknown phishing attack targeting Alabaster’s faction.

## Question 1

### Introduction
```
As you close out the investigation into Team Wombley’s attack, Eve Snowshoes meets you with a serious expression. "You’ve done an incredible job so far, but now we face our most elusive adversary yet. This isn’t just another team—it’s an unknown, highly skilled threat actor who has been operating in the shadows, leaving behind only whispers of their presence. We’ve seen traces of their activity, but they’ve covered their tracks well."

She pauses, the weight of the challenge ahead clear. "This is where things get even more difficult. We’re entering uncharted territory—prepare yourself for the toughest investigation yet. Follow the clues, stay sharp, and let’s uncover the truth behind these Echoes in the Frost."

Type `stay frosty` to begin
```

### Solution
I submit `stay frosty` as the answer, as indicated in the introduction.

Answer: `stay frosty`

## Question 2

### Introduction
```
Noel Boetie, the IT administrator, reported receiving strange emails about a breach from colleagues. These emails might hold the first clue in uncovering the unknown threat actor’s methods. Your task is to identify when the first of these suspicious emails was received.

Eve Snowshoes remarks, "The timing of these phishing emails is critical. If we can identify the first one, we’ll have a better chance of tracing the threat actor’s initial moves."

What was the timestamp of first phishing email about the breached credentials received by Noel Boetie?
```

### Solution
I start by querying the Employees table for the email address of the person in question.

```
Employees
| where name has "Noel Boetie"
| distinct email_addr
```

Now that I have the email address `noel_boetie@santaworkshopgeeseislands.org`, I search for emails sent to him with the word `breach` in the subject.

```
Email
| where recipient has "noel_boetie@santaworkshopgeeseislands.org"
| where subject has "breach"
| sort by timestamp asc
```

The query returns three emails. The first one was received on `2024-12-12T14:48:55Z` and the log shows that the file name associated with this email is `echo.exe`.

Answer: `2024-12-12T14:48:55Z`

## Question 3

### Introduction
```
Noel Boetie followed the instructions in the phishing email, downloading and running the file, but reported that nothing seemed to happen afterward. However, this might have been the key moment when the unknown threat actor infiltrated the system.

When did Noel Boetie click the link to the first file?
```

### Solution
I start by querying for the IP address in the Employees table.

```
Employees
| where name has "Noel Boetie"
| distinct ip_addr
```

Now that I know the IP address `10.10.0.9`, I query the outbound network logs for any activities from this IP address in the time period shortly after the email was received.

```
OutboundNetworkEvents
| where timestamp between (datetime("2024-12-12T14:48:00Z") .. datetime("2024-12-12T16:00:00Z"))
| where has_ipv4(src_ip, "10.10.0.9")
| where url has "echo.exe"
```

The query returns a log with the timestamp `2024-12-12T15:13:55Z`.

Answer: `2024-12-12T15:13:55Z`

## Question 4

### Introduction
```
The phishing email directed Noel Boetie to download a file from an external domain.

Eve Snowshoes, "The domain and IP they used to host the malicious file is a key piece of evidence. It might lead us to other parts of their operation, so let’s find it."

What was the IP for the domain where the file was hosted?
```

### Solution
Since I found that the file echo.exe is hosted on the domain `holidaybargainhunt.io`, I now query for DNS logs related to that domain.

```
PassiveDns
| where domain has "holidaybargainhunt.io"
| distinct ip
```

The DNS query reveals that the IP address for the domain `holidaybargainhunt.io` is `182.56.23.122`.

Answer: `182.56.23.122`

## Question 5

### Introduction
```
Let’s back up for a moment. Now that we’re thinking this through, how did the unknown threat actor gain the credentials to execute this attack? We know that three users have been sending phishing emails, and we’ve identified the domain they used.

It’s time to dig deeper into the AuthenticationEvents and see if anything else unusual happened that might explain how these accounts were compromised.

Eve Snowshoes suggests, "We need to explore the AuthenticationEvents for these users. Attackers often use compromised accounts to blend in and send phishing emails internally. This might reveal how they gained access to the credentials."

Let’s take a closer look at the authentication events. I wonder if any connection events from 182.56.23.122. If so what hostname was accessed?
```

### Solution
I start by search querying for the IP address `182.56.23.122` as the source ip in authentication events to track any related activities.

```
AuthenticationEvents
| where has_ipv4(src_ip, "182.56.23.122")
```

The search reveals a log with the hostname `WebApp-ElvesWorkshop`.

Answer: `WebApp-ElvesWorkshop`

## Question 6

### Introduction
```
It appears someone accessed the WebApp-ElvesWorkshop from the IP address 182.56.23.122. This could be a key moment in the attack. We need to investigate what was run on the app server and, more importantly, if the threat actor dumped any credentials from it.

Eve Snowshoes, "Accessing the web app from an external IP is a major red flag. If they managed to dump credentials from the app server, that could explain how they gained access to other parts of the system."

What was the script that was run to obtain credentials?
```

### Solution
I start by querying for the hostname `WebApp-ElvesWorkshop` in the ProcessEventLogs to investigate any related activities.

```
ProcessEvents
| where hostname has "WebApp-ElvesWorkshop"
```

The query reveals a log showing that `Invoke-Mimikatz.ps1` was downloaded from GitHub. This indicates a potential use of the Mimikatz tool, often associated with credential theft and malicious activities.

Answer: `Invoke-Mimikatz.ps1`

## Question 7

### Introduction
```
Okay back to Noel, after downloading the file, Noel Boetie followed the instructions in the email and ran it, but mentioned that nothing appeared to happen.

Since the email came from an internal source, Noel assumed it was safe - yet this may have been the moment the unknown threat actor silently gained access. We need to identify exactly when Noel executed the file to trace the beginning of the attack.

Eve Snowshoes, "It’s easy to see why Noel thought the email was harmless - it came from an internal account. But attackers often use compromised internal sources to make their phishing attempts more believable."

What is the timestamp where Noel executed the file?
```

### Solution
To find the timestamp of when echo.exe was first opened by Noel, I search for process commandlines that contain echo.exe.

```
ProcessEvents
| where process_commandline has "echo.exe"
```

The search reveals a single result, showing that echo.exe was first opened at `2024-12-12T15:14:38Z`.

Answer: `2024-12-12T15:14:38Z`

## Question 8

### Introduction
```
After Noel ran the file, strange activity began on the system, including the download of a file called holidaycandy.hta. Keep in mind that attackers often use multiple domains to host different pieces of malware.

Eve explains, "Attackers frequently spread their operations across several domains to evade detection."

What domain was the holidaycandy.hta file downloaded from?
```

### Solution
I start by querying for network logs where the file name `halidaycandy.hta` is included in the URL to track any network activity associated with the file.

```
OutboundNetworkEvents
| where url has "holidaycandy.hta"
```

The query returns two log entries, both with the same URL: `http://compromisedchristmastoys.com/holidaycandy.hta`.

Answer: `compromisedchristmastoys.com`

## Question 9

### Introduction
```
An interesting series of events has occurred: the attacker downloaded a copy of frosty.txt, decoded it into a zip file, and used tar to extract the contents of frosty.zip into the Tasks directory.

This suggests the possibility that additional payloads or tools were delivered to Noel’s laptop. We need to investigate if any additional files appeared after this sequence.

Eve Snowshoes, "When an attacker drops files like this, it’s often the prelude to more malicious actions. Let’s see if we can find out what else landed on Noel’s laptop."

Did any additional files end up on Noel’s laptop after the attacker extracted frosty.zip?

what was the first file that was created after extraction?
```

### Solution
I query the FileCreationEvents table for logs that match the username and hostname for Noel in the time period shortly after the zip-file was opened.

```
FileCreationEvents
| where timestamp between (datetime("2024-12-24T17:19:45Z") .. datetime("2024-12-24T18:00:00Z"))
| where hostname has "Elf-Lap-A-Boetie"
| where username has "noboetie"
```

The query returns a log entry showing that the file `sqlwriter.exe` was created, which likely indicates the presence of a new executable associated with Noel's activities.

Answer: `sqlwriter.exe`

## Question 10

### Introduction
```
In the previous question, we discovered that two files, sqlwriter.exe and frost.dll, were downloaded onto Noel’s laptop. Immediately after, a registry key was added that ensures sqlwriter.exe will run every time Noel’s computer boots.

This persistence mechanism indicates the attacker’s intent to maintain long-term control over the system.

Eve Snowshoes, "Adding a registry key for persistence is a classic move by attackers to ensure their malicious software runs automatically. It’s crucial to understand how this persistence is set up to prevent further damage."

What is the name of the property assigned to the new registry key?
```

### Solution
I start by quering for process events that are associated with the file `sqlwriter.exe`, which was created in the previous step.

```
ProcessEvents
| where process_commandline has "sqlwriter.exe"
```

The query returns a single log, which contains the following PowerShell:

```powershell
New-Item -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "MS SQL Writer" -Force | New-ItemProperty -Name "frosty" -Value "C:\Windows\Tasks\sqlwriter.exe" -PropertyType String -Force
```

Within the PowerShell I can see, that the property name is set to `frosty`.

Answer: `frosty`

## Question 11

### Introduction
```
Congratulations! You've successfully identified the threat actor's tactics. The attacker gained access to WebApp-ElvesWorkshop from the IP address 182.56.23.122, dumped credentials, and used those to send phishing emails internally to Noel.

The malware family they used is called Wineloader, which employs a technique known as DLL sideloading. This technique works by placing a malicious DLL in the same directory as a legitimate executable (in this case, sqlwriter.exe).

When Windows tries to load a referenced DLL without a full path, it checks the executable's current directory first, causing the malicious DLL to load automatically. Additionally, the attacker created a scheduled task to ensure sqlwriter.exe runs on system boot, allowing the malicious DLL to maintain persistence on the system.

To obtain your FINAL flag use the KQL below with your last answer!

let finalflag = "Change This!";
let base64_encoded = base64_encode_tostring(finalflag);
print base64_encoded
```

### Solution
I now take the template from the introduction and insert the answer from the previous task, which is `frosty`, into the appropriate field.

```
let finalflag = "frosty";
let base64_encoded = base64_encode_tostring(finalflag);
print base64_encoded
```

The query returns the Base64 value `ZnJvc3R5`.

Answer: `ZnJvc3R5`

> [!NOTE]
> The answer must also be submitted under `objectives`
