/*
    ORBIT DRIVING SCHOOL
    Developed by AMAL THIRUTHOOR
    All Rights Reserved
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycbzThklTmTolDTu1ykbFZaVKcwQLS-egX8C-qsnPCaDMbKTmse6GE4U63qzHPBx_tiRu/exec";


document.addEventListener("DOMContentLoaded", function () {

    const dateInput =
        document.getElementById("date");

    const timeSlots =
        document.querySelectorAll(".time-slot");

    const confirmButton =
        document.getElementById("confirmBooking");

    const bookingMessage =
        document.getElementById("bookingMessage");

    let selectedTime = "";


    /* =========================
       SET MINIMUM DATE
    ========================= */

    if (dateInput) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        dateInput.min =
            `${year}-${month}-${day}`;
    }


    /* =========================
       TIME SLOT SELECTION
    ========================= */

    timeSlots.forEach(function (slot) {

        slot.addEventListener(
            "click",
            function () {

                timeSlots.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );

                this.classList.add(
                    "selected"
                );

                selectedTime =
                    this.textContent.trim();

            }
        );

    });


    /* =========================
       CONFIRM BOOKING
    ========================= */

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            async function () {

                const service =
                    document.getElementById(
                        "service"
                    ).value;

                const date =
                    document.getElementById(
                        "date"
                    ).value;

                const name =
                    document.getElementById(
                        "name"
                    ).value.trim();

                const phone =
                    document.getElementById(
                        "phone"
                    ).value.trim();

                const remarks =
                    document.getElementById(
                        "remarks"
                    ).value.trim();


                /* =========================
                   VALIDATION
                ========================= */

                if (!service) {

                    alert(
                        "Please select a service."
                    );

                    return;
                }


                if (!date) {

                    alert(
                        "Please select a date."
                    );

                    return;
                }


                if (!selectedTime) {

                    alert(
                        "Please select an appointment time."
                    );

                    return;
                }


                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;
                }


                if (!phone) {

                    alert(
                        "Please enter your phone number."
                    );

                    return;
                }


                if (!/^[0-9]{10}$/.test(phone)) {

                    alert(
                        "Please enter a valid 10-digit phone number."
                    );

                    return;
                }


                /* =========================
                   DISABLE BUTTON
                ========================= */

                confirmButton.disabled = true;

                confirmButton.textContent =
                    "Booking...";


                bookingMessage.className =
                    "booking-message";

                bookingMessage.textContent =
                    "";


                /* =========================
                   BOOKING DATA
                ========================= */

                const bookingData = {

                    action: "book",

                    date: date,

                    time: selectedTime,

                    service: service,

                    name: name,

                    phone: phone,

                    remarks: remarks

                };


                /* =========================
                   SEND TO GOOGLE SHEETS
                ========================= */

                try {

                    const response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "text/plain;charset=utf-8"
                                },

                                body:
                                    JSON.stringify(
                                        bookingData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    /* =========================
                       SUCCESS
                    ========================= */

                    if (result.success) {

                        bookingMessage.innerHTML =
                            "<strong>Booking Confirmed!</strong><br><br>" +
                            "Booking ID: <strong>" +
                            result.bookingId +
                            "</strong><br>" +
                            "Date: " +
                            result.date +
                            "<br>" +
                            "Time: " +
                            result.time +
                            "<br><br>" +
                            "Thank you for booking with ORBIT Driving School.";

                        bookingMessage.className =
                            "booking-message success";


                        /* Clear form */

                        document.getElementById(
                            "service"
                        ).value = "";

                        document.getElementById(
                            "date"
                        ).value = "";

                        document.getElementById(
                            "name"
                        ).value = "";

                        document.getElementById(
                            "phone"
                        ).value = "";

                        document.getElementById(
                            "remarks"
                        ).value = "";


                        timeSlots.forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        selectedTime = "";


                        bookingMessage.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    } else {

                        /* =========================
                           BOOKING FAILED
                        ========================= */

                        alert(
                            result.message ||
                            "Booking failed. Please try again."
                        );

                    }


                } catch (error) {

                    console.error(
                        "Booking Error:",
                        error
                    );

                    alert(
                        "Unable to connect to the booking server. Please try again."
                    );


                } finally {

                    confirmButton.disabled =
                        false;

                    confirmButton.textContent =
                        "Confirm Booking";

                }

            }
        );

    }

});
