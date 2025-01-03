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

