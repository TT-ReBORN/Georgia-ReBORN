//
// Demonstrates utils.ParseHtml(), HtmlDocument, and HtmlNode.
//

function log_section(title) {
    console.log("");
    console.log("=== " + title + " ===");
}

function normalize_text(s) {
    return (s || "").replace(/\s+/g, " ").trim();
}

// This example uses the same structure as samples/basic/html/parse_test.html.
// const html = utils.ReadUTF8(`${fb.ComponentPath}\\samples\\basic\\html\\parse_test.html`);
const html = `
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Lexbor Parser Test</title>
	<meta property="og:title" content="Test Artist Biography">
</head>
<body>
	<main id="page" class="artist-page biography">
		<h1 class="artist-name">Test Artist</h1>

		<section class="wiki-content" data-source="lastfm">
			<p>
				Test Artist is an experimental music project from London.
				The project combines <strong>ambient</strong>, <em>industrial</em>,
				and electronic music.
			</p>

			<p>
				Their first album,
				<a href="/music/Test+Artist/First+Album" class="album-link">First Album</a>,
				was released in 2020.
			</p>
		</section>

		<section class="albums">
			<h2>Albums</h2>

			<ul class="album-list">
				<li class="album" data-year="2020">
					<a href="/music/Test+Artist/First+Album">First Album</a>
				</li>
				<li class="album featured" data-year="2022">
					<a href="/music/Test+Artist/Second+Album">Second Album</a>
				</li>
				<li class="album" data-year="2024">
					<span>No link album</span>
				</li>
			</ul>
		</section>

		<section class="external-links">
			<h2>External links</h2>

			<ul>
				<li>
					text before link
					<a href="https://example.com/artist" rel="external">Official site</a>
				</li>
				<li>
					<!-- comment before link -->
					<a href="https://musicbrainz.org/artist/test">MusicBrainz</a>
				</li>
				<li>
					<span>Broken item without href</span>
				</li>
			</ul>
		</section>
	</main>
</body>
</html>
`;

const doc = utils.ParseHtml(html);

if (!doc) {
    console.log("Parse failed.");
} else {
    log_section("Document basics");

    console.log("documentElement tag:", doc.documentElement.tagName); // html
    console.log("root tag:", doc.root.tagName);                       // html
    console.log("head innerHTML:", normalize_text(doc.head.innerHTML));
    console.log("body text:", normalize_text(doc.body.textContent));

    log_section("querySelector");

    const title = doc.querySelector("title");
    console.log("title:", title ? title.textContent : "<missing>");

    const artistName = doc.querySelector(".artist-name");
    console.log("artist:", artistName ? artistName.textContent : "<missing>");

    const wiki = doc.querySelector(".wiki-content");
    if (wiki) {
        console.log("wiki source:", wiki.getAttribute("data-source")); // lastfm
        console.log("wiki text:", normalize_text(wiki.textContent));
    }

    log_section("querySelectorAll");

    const albums = doc.querySelectorAll(".album");
    console.log("albums count:", albums.length); // 3

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];
        const link = album.querySelector("a");

        console.log(
            "album #" + (i + 1) + ":",
            "year=" + album.getAttribute("data-year"),
            "featured=" + album.hasClass("featured"),
            "title=" + (link ? normalize_text(link.textContent) : normalize_text(album.textContent)),
            "href=" + (link ? link.getAttribute("href") : "<no link>")
        );
    }

    log_section("Attribute selectors");

    const nodesWithClass = doc.querySelectorAll("[class]");
    console.log("nodes with class:", nodesWithClass.length);

    const featuredAlbums = doc.querySelectorAll(".album.featured");
    console.log("featured albums:", featuredAlbums.length);

    const albumToken = doc.querySelectorAll("[class~='album']");
    console.log("[class~='album']:", albumToken.length);

    log_section("getElementsByTagName");

    const allLinks = doc.getElementsByTagName("a");
    console.log("all links:", allLinks.length);

    for (let i = 0; i < allLinks.length; i++) {
        console.log(
            "#" + (i + 1),
            normalize_text(allLinks[i].textContent),
            "=>",
            allLinks[i].getAttribute("href")
        );
    }

    log_section("children vs childNodes");

    const p = doc.querySelector(".wiki-content p");

    console.log("p.children.length:", p.children.length);
    console.log("p.childNodes.length:", p.childNodes.length);

    // firstChild is a text node here. JSON.stringify() is used intentionally
    // to show that original whitespace and line breaks are preserved.
    console.log("p.firstChild text:", JSON.stringify(p.firstChild.textContent));

    log_section("Safe link extraction");

    const externalItems = doc.querySelectorAll(".external-links li");

    for (let i = 0; i < externalItems.length; i++) {
        const li = externalItems[i];

        // Do not use li.firstChild.getAttribute("href"):
        // firstChild can be a text node or a comment.
        const a = li.querySelector("a[href]");

        if (!a) {
            console.log("external item #" + (i + 1) + ": no link");
            continue;
        }

        console.log(
            "external item #" + (i + 1) + ":",
            normalize_text(a.textContent),
            "=>",
            a.getAttribute("href")
        );
    }

    log_section("Missing nodes");

    console.log("missing node:", doc.querySelector(".missing"));          // null
    console.log("missing list length:", doc.querySelectorAll(".missing").length); // 0
}
