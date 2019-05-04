/*
    populates DOM with name, email, sign-up date and description
    of logged-in user, based on data object provided
*/
function populateDetails(data) {
    $("#name").text(data.fullName);
    $("#email").text(data.email);
    $("#signup-date").text(data.createdAt.split("T")[0]);   // grab YYYY-MM-DD from ISODate
    $("#description").text(data.description);
}

/*
    queries '/users/${profileId}' to grab other details about logged-in user,
    calls populateDetails to populate DOM with user profile information
*/
function getDetails() {
    const profileId = sessionStorage.getItem('profileId');
    if(profileId) {
        $.getJSON(`/users/${profileId}`, (data) => {
            populateDetails(data);
        });
    }
}

/*
    PUTs to '/users/${profileId}' to change logged-in user's 'description',
    calls 'populateDetails' to repopulate DOM with updated user profile information
*/
function changeDescription() {
    const newDescription = $("textarea#description").val();
    const profileId = sessionStorage.getItem('profileId');
    $.ajax({
        url: `/users/${profileId}`,
        type: "PUT",
        data: {description: newDescription}
    })
    .done((data) => {
        populateDetails(data);
    })
    .fail((xhr, status, err) => {
        console.err(`Error changing description: ${err}`);
    });
}

/*
    kicks off DOM population of logged-in user's information,
    binds 'changeDescription' function to 'Change description' button
*/
$(document).ready(function() {
    getDetails();
    $("#change-button").click(changeDescription);
});