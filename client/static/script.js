function shortenUrl(event) {
	event.preventDefault();
	const url = document.getElementById("url").value;
	fetch("https://url-shortner-api-t5uy.onrender.com/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ url }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				const element = document.getElementById("url");
				element.classList.add("error-border");
				throw new Error("Request failed");
			}
		})
		.then((data) => {
			console.log(data);
			const shortUrl = data["short-url"];
			const element = document.getElementById("url");
			element.classList.remove("error-border");
			document.getElementById("url").value = "";
			createShortUrlElement(url, shortUrl);
		})
		.catch((err) => console.log(err));
}

function createShortUrlElement(longUrlStr, shortUrlStr) {
	const container = document.createElement("div");
	container.className = "list";

	const listElement = document.createElement("div");
	listElement.className = "list-element";
	listElement.id = shortUrlStr;

	const longUrlLink = document.createElement("a");
	longUrlLink.textContent = longUrlStr;
	longUrlLink.href = longUrlStr;
	longUrlLink.target = "_blank";

	const heading = document.createElement("h3");
	heading.appendChild(longUrlLink);
	listElement.appendChild(heading);

	const shortUrlContainer = document.createElement("div");
	shortUrlContainer.className = "short-url";

	const shortUrlSpan = document.createElement("span");
	shortUrlSpan.textContent = shortUrlStr;
	shortUrlSpan.id = "short-url";
	shortUrlContainer.appendChild(shortUrlSpan);

	const copyButton = document.createElement("button");
	copyButton.className = "copy-button";
	copyButton.textContent = "Copy";
	copyButton.addEventListener("click", () => {
		navigator.clipboard
			.writeText(shortUrlStr)
			.then(() => {
				copyButton.classList.add("copied");
				copyButton.textContent = "Copied!";
				console.log("URL copied to clipboard");
			})
			.catch((err) => {
				console.log("Failed to copy URL to clipboard:", err);
			});
	});
	shortUrlContainer.appendChild(copyButton);

	listElement.appendChild(shortUrlContainer);
	container.appendChild(listElement);
	document.body.appendChild(container);
}
