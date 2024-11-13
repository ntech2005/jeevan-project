
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - (window.innerHeight / 3) + (targetElement.clientHeight / 2),
                behavior: 'smooth'
            });
        });
    });
    const slides = document.querySelectorAll('.slide');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;

    // Function to show slides
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Show next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // Show previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    // Add event listeners for navigation buttons
    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);

    // Add event listeners for bullet dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Auto-play slider every 5 seconds
    setInterval(nextSlide, 5000);

    async function getWeather(location) {
        const apiKey = '33aa8aaec37f0edf30e1a43bd321ce65'; // Replace with your API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.weather && data.weather.length > 0) {
                return data.weather[0].main; // Returns weather condition (e.g., Rain)
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
        return null; // Return null if fetching failed
    }

    async function calculatePrice() {
        // Base price in INR
        let basePrice = 500; // Base price for one-way

        // Get form values
        const tripType = document.querySelector('input[name="trip-type"]:checked').value;
        const departureDate = new Date(document.getElementById('departure').value);
        const currentDate = new Date();
        const hours = parseInt(document.getElementById('hours').value);
        const minutes = parseInt(document.getElementById('minutes').value);
        const ampm = document.getElementById('ampm').value;
        const location = document.getElementById('from').value; // Use the pickup location

        // Convert 12-hour time to 24-hour time
        let fullHours = (ampm === "PM" && hours !== 12) ? hours + 12 : (ampm === "AM" && hours === 12) ? 0 : hours;

        // Fetch weather data
        const weatherCondition = await getWeather(location);
        console.log("Weather Condition:", weatherCondition);

        // Calculate time difference from now
        let timeDifference = Math.abs(departureDate - currentDate) / 36e5; // Time difference in hours

        // Weather Impact (assuming rain adds a surcharge)
        let weatherMultiplier = (weatherCondition === "Rain") ? 1.5 : 1; // 50% increase for rain

        // Time of Day Impact (Night prices increase, 10 PM to 5 AM)
        let timeMultiplier = (fullHours >= 22 || fullHours < 5) ? 1.5 : 1;

        // Trip Type Impact (Two-way trip doubles the price)
        let tripMultiplier = tripType === "two-way" ? 2 : 1;

        // Calculate final price
        let finalPrice = basePrice * timeMultiplier * weatherMultiplier * tripMultiplier;

        // Display the final price
        document.getElementById("price").innerText = `Estimated Price: INR ${finalPrice.toFixed(2)}`;
    }

    let basePrice = 0;

    function selectPackage(packageName, price) {
        document.getElementById('selected-package').value = packageName;
        basePrice = price;
        scrollToForm();
    }

    function scrollToForm() {
        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
    }

    async function getWeather(location) {
        const apiKey = '33aa8aaec37f0edf30e1a43bd321ce65'; // Replace with your API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.weather && data.weather.length > 0) {
                return data.weather[0].main; // Returns weather condition (e.g., Rain)
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
        return null;
    }

    async function calculateTourPrice() {
        const location = document.getElementById('location').value;
        const weatherCondition = await getWeather(location);

        // Base price multiplier
        let weatherMultiplier = (weatherCondition === "Rain") ? 1.5 : 1; // 50% surcharge for rain
        let finalPrice = basePrice * weatherMultiplier;

        document.getElementById('estimated-price').innerText = `Estimated Price: INR ${finalPrice.toFixed(2)}`;
    }

    function toggleExtraPackages() {
        const extraPackages = document.querySelector('.extra-packages');
        const viewMoreButton = document.getElementById('view-more');
        
        if (extraPackages.style.display === "none") {
            extraPackages.style.display = "flex"; // show extra packages
            viewMoreButton.innerText = "View Less"; // change button text
        } else {
            extraPackages.style.display = "none"; // hide extra packages
            viewMoreButton.innerText = "View More"; // change button text
        }
    }

  
    function toggleText(postId) {
        const moreText = document.getElementById(`more-text-${postId}`);
        const link = document.querySelector(`[onclick="toggleText(${postId})"]`);

        if (moreText.style.display === "none") {
            moreText.style.display = "block";
            link.innerText = "Read Less";
        } else {
            moreText.style.display = "none";
            link.innerText = "Read More";
        }
    }

    // Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function sendToWhatsApp() {
    // Collect form data
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    var departure = document.getElementById('departure').value;
    var phone = document.getElementById('phone').value;
    var tripType = document.querySelector('input[name="trip-type"]:checked').value;
    var hours = document.getElementById('hours').value;
    var minutes = document.getElementById('minutes').value;
    var ampm = document.getElementById('ampm').value;
    var departureTime = hours + ':' + minutes + ' ' + ampm;
    var price = document.getElementById('price').innerText.replace('Estimated Price: INR ', '');
    
    // Collect new fields: Name and Email
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    
    // Construct the message
    var message = `*Taxi Booking Details*\n\nName: ${name}\nEmail: ${email}\nFrom: ${from}\nTo: ${to}\nDeparture Date: ${departure}\nDeparture Time: ${departureTime}\nPhone Number: ${phone}\nTrip Type: ${tripType}\nEstimated Price: INR ${price}\n`;
    
    // Encode the message
    var encodedMessage = encodeURIComponent(message);
    
    // Send the message via WhatsApp (Replace with your WhatsApp phone number)
    var whatsappURL = `https://wa.me/919217842071?text=${encodedMessage}`;
    
    // Open the WhatsApp link
    window.open(whatsappURL, '_blank');
}
