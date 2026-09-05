import requests


LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"


def get_user_profile(username: str):
    query = """
    query userProfile($username: String!) {
        matchedUser(username: $username) {
            username

            profile {
                realName
                aboutMe
                countryName
                ranking
                reputation
                starRating
            }

            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }

            badges {
                id
                name
                displayName
                icon
            }

            submissionCalendar
        }

        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
        }
    }
    """

    response = requests.post(
        LEETCODE_GRAPHQL_URL,
        json={
            "query": query,
            "variables": {"username": username},
        },
        headers={
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com/",
        },
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    if data.get("errors"):
        raise ValueError(data["errors"])

    user = data["data"]["matchedUser"]

    if user is None:
        raise ValueError("LeetCode user not found")

    contest = data["data"].get("userContestRanking")

    return {
        "username": user["username"],
        "profile": user["profile"],
        "solved": user["submitStats"]["acSubmissionNum"],
        "badges": user["badges"],
        "contest": contest,
        "submissionCalendar": user.get("submissionCalendar"),
    }