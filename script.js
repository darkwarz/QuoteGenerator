(function() {
	'use strict';
	var apiUrlBase = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
	var quoteContainerElem = document.querySelector('.js-quoteContainer');
	var quoteBtnElem = document.querySelector('.js-getQuoteBtn');
	var quoteElem = document.querySelector('.js-quote');
	var quoteAuthorElem = document.querySelector('.js-quoteAuthor');
	var shareBtnElemTwitter = document.querySelector('.js-twitterBtn'); //twitter variable pointing to html button
	var shareBtnElemFacebook = document.querySelector('.js-facebookBtn'); // faceboook variable pointing to html button
	var backupQuotes = [{
		content: "I'd rather attempt to do something great and fail than to attempt to do nothing and succeed.",
		title: "Robert H. Schuller"
	}, {
		content: "Thousands of geniuses live and die undiscovered - either by themselves or by others.",
		title: "Mark Twain"
	}, {
		content: "We may give without loving, but we cannot love without giving.",
		title: "Bernard Meltzer"
	}, {
		content: "Every great inspiration is but an experiment - though every experiment we know, is not a great inspiration.",
		title: "Charles Ives"
	}, {
		content: "The secret of getting ahead is getting started.",
		title: "Mark Twain"
	}];
	var randomQuote;
	var errorMsg;
	// Load quote into view
	function loadQuote(quote) {
		quoteElem.innerHTML = quote.content;
		quoteAuthorElem.textContent = quote.title;
		updateShareBtn(quote);
	}

	function updateShareBtn(quote) {
		shareBtnElemTwitter.href = "https://twitter.com/intent/tweet?text=" + quote.href;
		shareBtnElemFacebook.href = "https://facebook.com"
	}
	// Take out HTML and ASCII => Decode => Encode
	function scrubQuote(data) {
		data.content = data.content.replace(/(<([^>]+)>)/ig, "");
		data.href = data.content.replace(/&#(\d+);/g, function(m, n) {
			return String.fromCharCode(n);
		});
		data.href = encodeURI(data.href + ' –' + data.title);
		return data;
	}

	function loadError() {
		if (errorMsg === undefined && window.location.protocol === "https:") {
			errorMsg = document.createElement('div');
			errorMsg.classList += 'quoteError';
			errorMsg.textContent = 'Unfortunately the API we are using is on an http protocol. We\'re serving up backup quotes, but if you want new ones, please change from "https://" to "http://" in your URL.';
			quoteContainerElem.appendChild(errorMsg);
		}
	}
	// Setup request to API
	function requestQuote() {
		var apiUrl = apiUrlBase + '?' + Math.round(new Date().getTime() / 1000);
		var request = new XMLHttpRequest();
		var data;
		request.open('GET', apiUrl, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				data = JSON.parse(request.response)[0];
				loadQuote(scrubQuote(data));
			}
		};
		request.onerror = function() {
			console.log(request);
			randomQuote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
			loadQuote(scrubQuote(randomQuote));
			loadError();
		};
		request.send();
	}

	function init() {
		requestQuote();
		// Add event listener to button
		quoteBtnElem.addEventListener('click', requestQuote, false);
		// emoji support
		//   twemoji.size = '36x36';
		// twemoji.parse(document.body);
	}
	init();
}());