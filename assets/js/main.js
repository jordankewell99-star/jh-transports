document.addEventListener("DOMContentLoaded", function () {

  // Simple admin password
  let ADMIN_PASSWORD = "admin2025";

  // Button that opens the admin page
  let adminLink = document.getElementById("adminLink");

  // Logout button (appears on all pages)
  let logoutBtn = document.getElementById("logoutBtn");

  // --- LOGOUT ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("isAdmin");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }

  // --- BLOCK ADMIN PAGE IF NOT LOGGED IN ---
  if (window.location.pathname.includes("admin.html")) {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      alert("Access denied! Please login as admin first.");
      window.location.href = "index.html";
      return;
    }
  }

  // --- LOGIN AS ADMIN ---
  if (adminLink) {
    adminLink.addEventListener("click", function (e) {
      e.preventDefault();

      // If already logged in, open admin page directly
      if (sessionStorage.getItem("isAdmin") === "true") {
        window.location.href = "admin.html";
        return;
      }

      let pwd = prompt("Enter admin password:");

      if (pwd === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdmin", "true");
        alert("Welcome, admin!");
        window.location.href = "admin.html";
      } else {
        alert("Wrong password!");
      }
    });
  }

  // --- USER REGISTRATION (index page) ---
  let registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("userName").value.trim();
      let email = document.getElementById("userEmail").value.trim();

      if (name === "" || email === "") {
        alert("Please fill in all fields.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let emailExists = false;

      // Check if email already exists
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          emailExists = true;
        }
      }

      if (emailExists) {
        alert("This email is already registered.");
        return;
      }

      users.push({ name: name, email: email });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Welcome, " + name + "! Registration successful.");
      registerForm.reset();
    });
  }

  // --- ADMIN: ADD ROUTES ---
  let routeForm = document.getElementById("routeForm");
  let routeTable = document.querySelector("#routeTable tbody");

  if (routeForm) {
    routeForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("routeName").value.trim();
      let departure = document.getElementById("departureTime").value;
      let arrival = document.getElementById("arrivalTime").value;
      let maxSeats = parseInt(document.getElementById("maxSeats").value);
      let price = parseFloat(document.getElementById("price").value);

      if (name === "" || departure === "" || arrival === "" || !maxSeats || !price) {
        alert("Please fill all fields.");
        return;
      }

      let routes = JSON.parse(localStorage.getItem("routes")) || [];

      // Prevent duplicate route names
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].name === name) {
          alert("This route already exists.");
          return;
        }
      }

      routes.push({
        name: name,
        departure: departure,
        arrival: arrival,
        maxSeats: maxSeats,
        price: price
      });

      localStorage.setItem("routes", JSON.stringify(routes));
      alert("Route added successfully.");
      routeForm.reset();
      updateRouteList();
    });

    function updateRouteList() {
      let routes = JSON.parse(localStorage.getItem("routes")) || [];
      routeTable.innerHTML = "";

      for (let i = 0; i < routes.length; i++) {
        let r = routes[i];

        routeTable.innerHTML +=
          "<tr>" +
          "<td>" + r.name + "</td>" +
          "<td>" + r.departure + "</td>" +
          "<td>" + r.arrival + "</td>" +
          "<td>" + r.maxSeats + "</td>" +
          "<td>" + r.price + "</td>" +
          "</tr>";
      }
    }

    updateRouteList();
  }

  // --- BOOKING PAGE ---
  let bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    let routeSelect = document.getElementById("routeSelect");
    let routes = JSON.parse(localStorage.getItem("routes")) || [];

    routeSelect.innerHTML = "<option value=''>-- Select Route --</option>";

    for (let i = 0; i < routes.length; i++) {
      let opt = document.createElement("option");
      opt.value = routes[i].name;
      opt.textContent = routes[i].name;
      routeSelect.appendChild(opt);
    }

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("bookName").value.trim();
      let route = document.getElementById("routeSelect").value;
      let date = document.getElementById("bookDate").value;
      let seats = parseInt(document.getElementById("bookSeats").value);

      if (name === "" || route === "" || date === "" || !seats) {
        alert("Please complete all booking details.");
        return;
      }

      let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

      bookings.push({
        name: name,
        route: route,
        date: date,
        seats: seats
      });

      localStorage.setItem("bookings", JSON.stringify(bookings));
      alert("Booking confirmed for " + name + ".");
      bookingForm.reset();
    });
  }

  // --- REPORT PAGE ---
  let reportTable = document.querySelector("#reportTable tbody");

  if (reportTable) {
    let routes = JSON.parse(localStorage.getItem("routes")) || [];
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    reportTable.innerHTML = "";

    for (let i = 0; i < routes.length; i++) {
      let routeName = routes[i].name;
      let totalBookings = 0;
      let totalSeats = 0;

      for (let j = 0; j < bookings.length; j++) {
        if (bookings[j].route === routeName) {
          totalBookings++;
          totalSeats += bookings[j].seats;
        }
      }

      reportTable.innerHTML +=
        "<tr>" +
        "<td>" + routeName + "</td>" +
        "<td>" + totalBookings + "</td>" +
        "<td>" + totalSeats + "</td>" +
        "</tr>";
    }
  }

});