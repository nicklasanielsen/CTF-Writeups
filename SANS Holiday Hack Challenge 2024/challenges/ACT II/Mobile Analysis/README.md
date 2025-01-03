# Mobile Analysis

## Challenge Information
- **Difficulty**: 2 / 5
- **Description**: Help find who has been left out of the naughty AND nice list this Christmas. Please speak with Eve Snowshoes for more information.

## Table of Contents
0. [Challenge Information](#challenge-information)
1. [Dialog](#dialog)
2. [Files](#files)
3. [Solution: Silver](#solution-silver)
4. [Solution: Gold](#solution-gold)

## Dialog
Eve Snowshoes:
```
> Hi there, tech saviour! Eve Snowshoes and Team Alabaster in need of assistance.
> I've been busy creating and testing a modern solution to Santa’s Naughty-Nice List, and I even built an Android app to streamline things for Alabaster’s team.
> But here’s my tiny reindeer-sized problem: I made a debug version and a release version of the app.
> I accidentally left out a child's name on each version, but for the life of me, I can't remember who!
> Could you start with the debug version first, figure out which child’s name isn’t shown in the list within the app, then we can move on to release? I’d be eternally grateful!
```

## Files
- [SantaSwipe.apk - Debug Version](files/SantaSwipe.apk)
- [SantaSwipeSecure.aab - Release Version](files/SantaSwipeSecure.aab)

## Solution: Silver

To locate the forgotten children and determine if they are on the "Naughty" or "Nice" list, I started by decompiling the APK file using `JADX`. This allows us to inspect the application's code and uncover any hidden logic or clues related to the task.


Next, I examined `com.northpole.santaswipe.MainActivity` to gain a better understanding of how the application works. This is typically where the main functionality and entry point of the app are defined, so it's a great place to start looking for clues about the task at hand.

Here, I found several functions of interest:
- onCreate
- addToNaughtyList
- addToNiceList
- getNaughtyList
- getNiceList
- getNormalList
- removeFromAllLists

Now we can ignore or remove all lines containing `Intrinsics` as they only add validation code that isn't necessary for our analysis. There are also some conditional statements that don't perform any actions, so we can disregard those. Additionally, the code contains five different webView variables, likely a result of a decompilation error, as they are all set to `this.myWebView`. We can clean up this redundancy. After making these adjustments and formatting the code, we'll end up with the following version.

```Java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    DatabaseHelper dbHelper = new DatabaseHelper(this);
    SQLiteDatabase writableDatabase = dbHelper.getWritableDatabase();
    this.database = writableDatabase;

    View findViewById = findViewById(R.id.webview);
    this.myWebView = (WebView) findViewById;

    this.myWebView.getSettings().setJavaScriptEnabled(true);

    final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
        .addPathHandler("/res/", new WebViewAssetLoader.ResourcesPathHandler(this))
        .build();

    this.myWebView.setWebViewClient(new WebViewClient() {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            return WebViewAssetLoader.this.shouldInterceptRequest(Uri.parse(url));
        }
    });

    this.myWebView.addJavascriptInterface(new WebAppInterface(), "Android");
    this.myWebView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
}
```

Now the code is much more readable, making it easier to understand the flow. The script begins by establishing a connection to the database. It then locates the webview, enables JavaScript, sets the asset locations, and ultimately loads the `/assets/index.html` file.

The `index.html` file, located under the resources in the assets folder, outlines the app's layout. Upon inspecting it, we see that it loads three lists: `Normal/Unlisted`, `Nice`, and `Naughty`.

To identify the missing child, we will start by examining the `Normal list`. This list is populated using the `getNormalList` function, which we previously found in the `MainActivity`. By cleaning up the code a bit further, we can arrive at the following result:

```Java
@JavascriptInterface
public final void getNormalList() {
    final String jsonItems;
    try {
        SQLiteDatabase sQLiteDatabase = MainActivity.this.database;
        Cursor cursor = sQLiteDatabase.rawQuery("SELECT Item FROM NormalList WHERE Item NOT LIKE '%Ellie%'", null);
        List items = new ArrayList();
        Log.d("WebAppInterface", "Fetching items from NormalList table");
        while (cursor.moveToNext()) {
            String item = cursor.getString(0);
            items.add(item);
            Log.d("WebAppInterface", "Fetched item: " + item);
        }
        cursor.close();
        if (items.isEmpty()) {
            jsonItems = "[]";
        } else {
            jsonItems = CollectionsKt.joinToString$default(items, "\",\"", "[\"", "\"]", 0, null, null, 56, null);
        }
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public final void run() {
                MainActivity.WebAppInterface.getNormalList$lambda$0(jsonItems, MainActivity.this);
            }
        });
    } catch (Exception e) {
        Log.e("WebAppInterface", "Error fetching NormalList: " + e.getMessage());
    }
}
```

Immediately on one of the first lines we can see an SQL query.

```SQL
SELECT Item FROM NormalList WHERE Item NOT LIKE '%Ellie%'
```

The query retrieves all items from the list, excluding those containing `Ellie`. This means that the missing child is identified, and Silver is unlocked.

## Solution: Gold

To begin, I decompile the ABB file.

Once we've successfully decompiled the file and reconstructed the Java files, it's time to examine the code. We'll follow the same approach as with the Silver challenge, starting with the `onCreate` method in the `MainActivity.java` file. After cleaning up the file, it will look as follows.

```Java
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        String string = getString(R.string.iv);
        byte[] decode = Base64.decode(StringsKt.trim((CharSequence) string).toString(), 0);
        this.staticIv = decode;
        String string2 = getString(R.string.ek);
        byte[] decode2 = Base64.decode(StringsKt.trim((CharSequence) string2).toString(), 0);
        this.secretKey = new SecretKeySpec(decode2, 0, decode2.length, "AES");
        initializeDatabase();
        initializeWebView();
        initializeEncryption();
    } catch (IllegalArgumentException e) {
        Log.e("MainActivity", "Error during initialization: " + e.getMessage());
    }
}
```

In this step, we observe that the `onCreate` method begins by retrieving some string values, base64 decoding them, and storing them in the staticIv and secretKey variables. The presence of AES suggests that encryption is involved here.

To retrieve the values of these strings, we can look at the `resources/res/values/strings.xml` file. This is where Android stores string resources, which are used for localization. Upon examining the file, we find two entries that are referenced in the code.

```XML
<string name="ek">rmDJ1wJ7ZtKy3lkLs6X9bZ2Jvpt6jL6YWiDsXtgjkXw=</string>
<string name="iv">Q2hlY2tNYXRlcml4</string>
```

After retrieving the values, the onCreate method calls the initializeWebView method, which mirrors the implementation found in the MainActivity’s onCreate method in the SantaVision.apk. Additionally, it calls initializeEncryption, although this method appears to be empty.

Given that the index.html file remains unchanged, the next step is to examine the getNormalList method.

```Java
@JavascriptInterface
public final void getNormalList() {
    try {
        SQLiteDatabase sQLiteDatabase = MainActivity.this.database;
        Cursor rawQuery = sQLiteDatabase.rawQuery("SELECT Item FROM NormalList", null);
        ArrayList arrayList = new ArrayList();
        while (rawQuery.moveToNext()) {
            String string = rawQuery.getString(R.xml.backup_rules);
            String decryptData = decryptData(string);
            if (decryptData != null) {
                arrayList.add(decryptData);
            }
        }
        rawQuery.close();
        final String joinToString$default = arrayList.isEmpty() ? "[]"
                : CollectionsKt.joinToString$default(arrayList, "\",\"", "[\"", "\"]", R.xml.backup_rules, null,
                        null, R.string.m3c_bottom_sheet_pane_title, null);
        MainActivity.this.runOnUiThread(new Runnable() {
            @Override
            public final void run() {
                MainActivity.WebAppInterface.getNormalList$lambda$0(MainActivity.this, joinToString$default);
            }
        });
    } catch (Exception unused) {
    }
}
```

This approach seems similar to the previous one, but unfortunately, the answer isn't found within the query this time. However, we notice an unusual function call at the string `decryptData = decryptData(string)`. This suggests that the database is returning the data in an encrypted format. Let's examine the implementation of the `decryptData` method to investigate further.

```Java
private final String decryptData(String encryptedData) {
    try {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] bArr = MainActivity.this.staticIv;
        GCMParameterSpec gCMParameterSpec = new GCMParameterSpec(128, bArr);
        SecretKey secretKey = MainActivity.this.secretKey;
        cipher.init(R.styleable.FontFamily, secretKey, gCMParameterSpec);
        byte[] doFinal = cipher.doFinal(Base64.decode(encryptedData, R.xml.backup_rules));
        return new String(doFinal, Charsets.UTF_8);
    } catch (Exception unused) {
        return null;
    }
}
```

It looks like the AES cipher is being used with the credentials we discovered earlier to decrypt the data. To understand how the database functions, let's dive into the `DatabaseHelper.java` file and begin by examining the constructor.

```Java
public DatabaseHelper(Context context) {
    super(context, DATABASE_NAME, (SQLiteDatabase.CursorFactory) null, R.xml.data_extraction_rules);
    String string = context.getString(R.string.ek);
    String obj = StringsKt.trim((CharSequence) string).toString();
    String string2 = context.getString(R.string.iv);
    String obj2 = StringsKt.trim((CharSequence) string2).toString();
    byte[] decode = Base64.decode(obj, R.xml.backup_rules);
    this.encryptionKey = decode;
    byte[] decode2 = Base64.decode(obj2, R.xml.backup_rules);
    this.iv = decode2;
    this.secretKeySpec = new SecretKeySpec(decode, "AES");
}
```

In this section, we encounter a similar setup to what we saw in the MainActivity. It loads the same AES key and IV values and stores them accordingly. Now, let's move on to the onCreate method to continue our analysis.

```Java
@Override
public void onCreate(SQLiteDatabase db) {
    db.execSQL("CREATE TABLE IF NOT EXISTS NiceList (Item TEXT);");
    db.execSQL("CREATE TABLE IF NOT EXISTS NaughtyList (Item TEXT);");
    db.execSQL("CREATE TABLE IF NOT EXISTS NormalList (Item TEXT);");
    db.execSQL(decryptData("IVrt+9Zct4oUePZeQqFwyhBix8cSCIxtsa+lJZkMNpNFBgoHeJlwp73l2oyEh1Y6AfqnfH7gcU9Yfov6u70cUA2/OwcxVt7Ubdn0UD2kImNsclEQ9M8PpnevBX3mXlW2QnH8+Q+SC7JaMUc9CIvxB2HYQG2JujQf6skpVaPAKGxfLqDj+2UyTAVLoeUlQjc18swZVtTQO7Zwe6sTCYlrw7GpFXCAuI6Ex29gfeVIeB7pK7M4kZGy3OIaFxfTdevCoTMwkoPvJuRupA6ybp36vmLLMXaAWsrDHRUbKfE6UKvGoC9d5vqmKeIO9elASuagxjBJ"));
    insertInitialData(db);
}
```

At this point, something interesting stands out. One of the queries executed at startup is encrypted. The `decryptData` method in the `DatabaseHelper` is slightly modified, but it operates in the same way as the others. Now, let's proceed by decrypting that data. Since we've already identified the key (ek) and the initialization vector (iv), the decryption should be relatively simple.

I decide to use Python for the decryption:

```Python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from base64 import b64decode

iv = b64decode("Q2hlY2tNYXRlcml4")
ek = b64decode("rmDJ1wJ7ZtKy3lkLs6X9bZ2Jvpt6jL6YWiDsXtgjkXw=")

def decryptData(encryptedData):
    return AESGCM(ek).decrypt(iv, b64decode(encryptedData), None)

decrypted_data = decryptData("IVrt+9Zct4oUePZeQqFwyhBix8cSCIxtsa+lJZkMNpNFBgoHeJlwp73l2oyEh1Y6AfqnfH7gcU9Yfov6u70cUA2/OwcxVt7Ubdn0UD2kImNsclEQ9M8PpnevBX3mXlW2QnH8+Q+SC7JaMUc9CIvxB2HYQG2JujQf6skpVaPAKGxfLqDj+2UyTAVLoeUlQjc18swZVtTQO7Zwe6sTCYlrw7GpFXCAuI6Ex29gfeVIeB7pK7M4kZGy3OIaFxfTdevCoTMwkoPvJuRupA6ybp36vmLLMXaAWsrDHRUbKfE6UKvGoC9d5vqmKeIO9elASuagxjBJ")

print(decrypted_data)
```

This will give us the following result.

```SQL
CREATE TRIGGER DeleteIfInsertedSpecificValue
    AFTER INSERT ON NormalList
    FOR EACH ROW
    BEGIN
        DELETE FROM NormalList WHERE Item = 'KGfb0vd4u/4EWMN0bp035hRjjpMiL4NQurjgHIQHNaRaDnIYbKQ9JusGaa1aAkGEVV8=';
    END;
```

This is quite interesting—there seems to be a trigger being created that will remove every item matching another encrypted string. Let's take a closer look at what the decrypted version reveals.

```Python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from base64 import b64decode

iv = b64decode("Q2hlY2tNYXRlcml4")
ek = b64decode("rmDJ1wJ7ZtKy3lkLs6X9bZ2Jvpt6jL6YWiDsXtgjkXw=")

def decryptData(encryptedData):
    return AESGCM(ek).decrypt(iv, b64decode(encryptedData), None)

decrypted_data = decryptData("KGfb0vd4u/4EWMN0bp035hRjjpMiL4NQurjgHIQHNaRaDnIYbKQ9JusGaa1aAkGEVV8=")

print(decrypted_data)
```

When the data is printed, it shows `b'Joshua, Birmingham, United Kingdom'`.

It appears that `Joshua` is not allowed to be on the list, and Gold is unlocked.