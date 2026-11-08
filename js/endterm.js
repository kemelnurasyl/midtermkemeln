
document.addEventListener("DOMContentLoaded", function () {

  // 1. ARRAY: 8 objects, each with 5 properties
  const clubData = [
    { id: 1, name: "Bekhan Shaizada", type: "Player", detail: "Goalkeeper", year: 0 },
    { id: 2, name: "Guy-Marcelin Kilama", type: "Player", detail: "Defender", year: 0 },
    { id: 3, name: "Elkhan Astanov", type: "Player", detail: "Midfielder", year: 0 },
    { id: 4, name: "Everton Moraes", type: "Player", detail: "Forward", year: 0 },
    { id: 5, name: "Kazakhstan Cup 2011", type: "Honour", detail: "Winner", year: 2011 },
    { id: 6, name: "Kazakhstan Super Cup 2012", type: "Honour", detail: "Winner", year: 2012 },
    { id: 7, name: "Kazakhstan Cup 2022", type: "Honour", detail: "Winner", year: 2022 },
    { id: 8, name: "Premier League 2023", type: "Honour", detail: "Champion", year: 2023 }
  ];

  const $id = id => document.getElementById(id);

  // 2. HOME: ticket price calculator
  function createTicketCalculator() {
    const path = window.location.pathname;

    if (!path.endsWith("index.html") && !path.endsWith("/")) {
      return;
    }

    const section = document.createElement("section");
    section.id = "endterm-tickets";
    section.className = "et-section";

    section.innerHTML = `
      <div class="container">
        <p class="et-label">FC ORDABASY / MATCHDAY</p>
        <h2 class="et-title">TICKET <span>CALCULATOR</span></h2>
        <p class="et-description">
          Plan your matchday budget. These are sample prices,
          not official ticket offers.
        </p>

        <div class="et-panel">
          <h3>Choose your seats</h3>

          <label class="form-label" for="ticketType">
            Ticket category
          </label>

          <select class="form-select" id="ticketType">
            <option value="1500">Standard - 1,500 KZT</option>
            <option value="3000">Premium - 3,000 KZT</option>
            <option value="5000">VIP - 5,000 KZT</option>
          </select>

          <label class="form-label mt-3" for="ticketQuantity">
            Number of tickets (1-8)
          </label>

          <input
            type="number"
            class="form-control"
            id="ticketQuantity"
            value="1"
            min="1"
            max="8"
            step="1"
          >

          <p id="ticketError" class="et-error"></p>

          <div class="et-total">
            <span>Total price</span>
            <strong id="totalPrice">1,500 KZT</strong>
          </div>

          <p class="et-note">
            Demo calculator only. No booking or payment.
          </p>
        </div>

        <div class="et-panel et-faq">
          <h3>Frequently Asked Questions</h3>

          <button class="et-question" type="button"
            aria-expanded="false">
            Are these official ticket prices?
          </button>
          <div class="et-answer" hidden>
            No, the prices are examples for this student project.
          </div>

          <button class="et-question" type="button"
            aria-expanded="false">
            Can I buy tickets here?
          </button>
          <div class="et-answer" hidden>
            No, this website demonstrates a ticket calculator.
          </div>

          <button class="et-question" type="button"
            aria-expanded="false">
            Where can I leave a prediction?
          </button>
          <div class="et-answer" hidden>
            Visit the Fan Zone on the Team page.
          </div>
        </div>
      </div>
    `;

    const anchor =
      document.querySelector(".manifesto") ||
      document.querySelector("footer");

    if (anchor) {
      anchor.before(section);
    } else {
      document.body.append(section);
    }

    // Price calculation
    function calculateTotal() {
      const price = Number($id("ticketType").value);
      const input = $id("ticketQuantity");
      const quantity = Number(input.value);

      if (
        input.value.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 8
      ) {
        $id("ticketError").textContent =
          "Enter a whole number from 1 to 8.";
        $id("totalPrice").textContent = "-";
        return;
      }

      $id("ticketError").textContent = "";

      const total = price * quantity;

      $id("totalPrice").textContent =
        total.toLocaleString("en-US") + " KZT";
    }

    $id("ticketType").addEventListener(
      "change", calculateTotal
    );

    $id("ticketQuantity").addEventListener(
      "input", calculateTotal
    );
  }

  // 3. TEAM: search, filter, sort
  function createExplorer() {
    if (!window.location.pathname.endsWith("team.html")) {
      return;
    }

    const section = document.createElement("section");
    section.id = "club-explorer";
    section.className = "et-section";

    section.innerHTML = `
      <div class="container">
        <p class="et-label">THE BLUE CITY</p>
        <h2 class="et-title">CLUB <span>EXPLORER</span></h2>
        <p class="et-description">
          Search our featured players and club achievements.
        </p>

        <div class="et-filters">
          <div>
            <label class="form-label" for="searchInput">
              Search
            </label>
            <input
              type="search"
              id="searchInput"
              class="form-control"
              placeholder="Search players or honours"
            >
          </div>

          <div>
            <label class="form-label" for="filterType">
              Category
            </label>
            <select id="filterType" class="form-select">
              <option value="All">All</option>
              <option value="Player">Players</option>
              <option value="Honour">Honours</option>
            </select>
          </div>

          <div>
            <label class="form-label" for="sortType">
              Sort
            </label>
            <select id="sortType" class="form-select">
              <option value="default">Default</option>
              <option value="az">A to Z</option>
              <option value="newest">Newest first</option>
            </select>
          </div>
        </div>

        <p id="resultCount" class="et-count"
           aria-live="polite"></p>

        <div id="clubCards" class="et-grid"></div>

        <p id="emptyMessage" class="et-empty" hidden>
          No results found. Try another search.
        </p>
      </div>
    `;

    const players = document.querySelector(".players-section");

    if (players) {
      players.after(section);
    } else {
      const footer = document.querySelector("footer");
      if (footer) footer.before(section);
      else document.body.append(section);
    }

    // Create cards using DOM manipulation
    function createCard(item) {
      const card = document.createElement("article");
      card.className = "et-card";

      const category = document.createElement("p");
      category.className = "et-card-type";
      category.textContent = item.type;

      const title = document.createElement("h3");
      title.textContent = item.name;

      const detail = document.createElement("p");
      detail.textContent = item.detail;

      card.append(category, title, detail);

      return card;
    }

    function renderCards() {
      const search = $id("searchInput").value
        .trim().toLowerCase();

      const type = $id("filterType").value;
      const sort = $id("sortType").value;

      // Filter array
      let results = clubData.filter(item => {
        const matchesSearch =
          item.name.toLowerCase().includes(search) ||
          item.detail.toLowerCase().includes(search);

        const matchesType =
          type === "All" || item.type === type;

        return matchesSearch && matchesType;
      });

      // Sort array
      if (sort === "az") {
        results.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }

      if (sort === "newest") {
        results.sort((a, b) => b.year - a.year);
      }

      // DOM update without page reload
      const container = $id("clubCards");
      container.replaceChildren();

      results.forEach(item => {
        container.appendChild(createCard(item));
      });

      $id("resultCount").textContent =
        results.length + " of " +
        clubData.length + " results";

      $id("emptyMessage").hidden =
        results.length !== 0;
    }

    $id("searchInput").addEventListener(
      "input", renderCards
    );

    $id("filterType").addEventListener(
      "change", renderCards
    );

    $id("sortType").addEventListener(
      "change", renderCards
    );

    renderCards();
  }

  // 4. FAN ZONE: Bootstrap form + validation
  function upgradeFanForm() {
    const form = document.querySelector(".fan-form");

    if (!form) return;

    form.noValidate = true;

    form.innerHTML = `
      <p class="et-form-note">
        Make your match prediction. Demo only.
      </p>

      <div class="mb-3">
        <label class="form-label" for="fanName">
          Full name
        </label>
        <input id="fanName" type="text"
          class="form-control">
        <p class="et-error" id="fanNameError"></p>
      </div>

      <div class="mb-3">
        <label class="form-label" for="fanEmail">
          Email
        </label>
        <input id="fanEmail" type="email"
          class="form-control">
        <p class="et-error" id="fanEmailError"></p>
      </div>

      <div class="mb-3">
        <label class="form-label" for="fanPhone">
          Phone
        </label>
        <input id="fanPhone" type="tel"
          class="form-control"
          placeholder="+7 777 123 4567">
        <p class="et-error" id="fanPhoneError"></p>
      </div>

      <div class="mb-3">
        <label class="form-label" for="homeGoals">
          Ordabasy goals
        </label>
        <input id="homeGoals" type="number"
          min="0" max="15" step="1"
          class="form-control">
        <p class="et-error" id="homeGoalsError"></p>
      </div>

      <div class="mb-3">
        <label class="form-label" for="awayGoals">
          Opponent goals
        </label>
        <input id="awayGoals" type="number"
          min="0" max="15" step="1"
          class="form-control">
        <p class="et-error" id="awayGoalsError"></p>
      </div>

      <div class="mb-3">
        <label class="form-label" for="fanMood">
          Match mood
        </label>
        <select id="fanMood" class="form-select">
          <option value="">Choose your mood</option>
          <option value="Excited">Excited</option>
          <option value="Confident">Confident</option>
          <option value="Nervous">Nervous</option>
        </select>
        <p class="et-error" id="fanMoodError"></p>
      </div>

      <button type="submit" class="submit-prediction">
        SEND PREDICTION
      </button>

      <div id="fanSuccess" class="et-success"
           role="status" aria-live="polite" hidden>
      </div>
    `;

    // Input validation rules
    const rules = {
      fanName: v =>
        v.length >= 2
          ? "" : "Enter at least 2 characters.",

      fanEmail: v =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? "" : "Enter a valid email address.",

      fanPhone: v =>
        /^\+?[\d\s()-]+$/.test(v) &&
        (v.match(/\d/g) || []).length >= 10
          ? "" : "Enter at least 10 phone digits.",

      homeGoals: v =>
        /^\d+$/.test(v) && Number(v) <= 15
          ? "" : "Enter a number from 0 to 15.",

      awayGoals: v =>
        /^\d+$/.test(v) && Number(v) <= 15
          ? "" : "Enter a number from 0 to 15.",

      fanMood: v =>
        v !== "" ? "" : "Choose your mood."
    };

    let attempted = false;

    function checkField(id) {
      const field = $id(id);
      const message = rules[id](field.value.trim());

      $id(id + "Error").textContent = message;

      field.classList.toggle(
        "is-invalid", message !== ""
      );

      return message === "";
    }

    // Remove errors when corrected
    Object.keys(rules).forEach(id => {
      const field = $id(id);
      const eventType =
        field.tagName === "SELECT" ? "change" : "input";

      field.addEventListener(eventType, () => {
        if (attempted) checkField(id);
        $id("fanSuccess").hidden = true;
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      attempted = true;

      const checks = Object.keys(rules)
        .map(id => checkField(id));

      if (!checks.every(Boolean)) {
        form.querySelector(".is-invalid")?.focus();
        return;
      }

      const name = $id("fanName").value.trim();
      const score =
        $id("homeGoals").value + " - " +
        $id("awayGoals").value;

      form.reset();
      attempted = false;

      Object.keys(rules).forEach(id => {
        $id(id + "Error").textContent = "";
        $id(id).classList.remove("is-invalid");
      });

      const success = $id("fanSuccess");

      success.textContent =
        `Thank you, ${name}! Your prediction ${score} ` +
        "was validated. No data was sent.";

      success.hidden = false;

      // jQuery effect 1: fadeIn
      if (window.jQuery) {
        window.jQuery(success)
          .stop(true, true)
          .hide()
          .fadeIn(350);
      }
    });
  }

  // 5. jQuery effects
  function addJQueryEffects() {
    if (!window.jQuery) return;

    const $ = window.jQuery;

    // Effect 2: slideToggle - FAQ accordion
    $(".et-question").on("click", function () {
      const answer = $(this).next(".et-answer");
      const isOpen =
        this.getAttribute("aria-expanded") === "true";

      this.setAttribute(
        "aria-expanded", String(!isOpen)
      );

      answer.stop(true, true);

      if (!isOpen) {
        answer.prop("hidden", false).hide();
      }

      answer.slideToggle(250, function () {
        if (isOpen) {
          answer.prop("hidden", true);
        }
      });
    });

    // Effect 3: animate - smooth scrolling
    $('a[href*="#"]').on("click", function (event) {
      const url = new URL(this.href, location.href);

      if (
        url.pathname !== location.pathname ||
        !url.hash
      ) return;

      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );

      if (!target) return;

      event.preventDefault();

      $("html, body").stop(true, true).animate({
        scrollTop: $(target).offset().top
      }, 400);

      history.replaceState(null, "", url.hash);
    });
  }

  // 6. Start all functions
  createTicketCalculator();
  createExplorer();
  upgradeFanForm();
  addJQueryEffects();

});
