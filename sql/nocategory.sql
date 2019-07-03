/*
    This File contains the SQL commands if NO CATEGORY is specified
*/
select tossups.text, tossups.formatted_answer, categories.categories_name, tournaments.name from tossups 
join tournaments on tossups.tournament_id = tournaments.id and tournaments.difficulty in (2,3,4,5) 
join categories on tossups.category_id = categories.id 
WHERE tossups.formatted_answer like '%<strong>%' or position(' ' in formatted_answer) <= 0 
or tossups.formatted_answer similar to '[a-zA-Z]+\s<[^strong^em^u>^b>]%' 
ORDER BY RANDOM() LIMIT ${number} 