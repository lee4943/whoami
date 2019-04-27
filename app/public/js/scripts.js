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
    queries '/current_user_data' to grab profileId of logged-in user if logged in;
    if so, queries '/users/${profileId}' to grab other details about logged-in user,
    calls populateDetails to populate DOM with user profile information
*/
function getDetails() {
    $.getJSON("/current_user_id", (data) => {   // TODO - refactor out duplicate code
        if(data) {
            const profileId = data.profileId;
            $.getJSON(`/users/${profileId}`, (data) => {
                populateDetails(data);
            });
        }
    });
}

/*
    queries '/current_user_data' to grab profileId of logged-in user if logged in;
    if so, PUTs to '/users/${profileId}' to change logged-in user's 'description',
    calls 'getDetails' to repopulate DOM with updated user profile information
*/
function changeDescription() {
    const newDescription = $("textarea#description").val();
    $.getJSON("/current_user_id", (data) => {   // TODO - refactor out duplicate code
        if(data) {
            const profileId = data.profileId;
            $.ajax({
                url: `/users/${profileId}`,
                type: "PUT",
                data: {description: newDescription},
                success: () => {
                  console.log(`Successfully added new description: ${newDescription}`);
                },
                error: () => {
                  console.log(`Error adding new description: ${newDescription}`);
                },
                complete: getDetails()
             });
        }
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