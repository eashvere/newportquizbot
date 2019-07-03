/*
    This File contains the SQL commands if A CATEGORY is specified
*/

select tossups.text, tossups.formatted_answer, categories.categories_name, tournaments.name from tossups 
join tournaments on tossups.tournament_id = tournaments.id and tournaments.difficulty in (2,3,4,5) 
join categories on tossups.category_id = categories.id 
WHERE (tossups.formatted_answer like '%<strong>%' or position(' ' in formatted_answer) <= 0) 
and lower(categories.categories_name) = lower(${categoryT}) 
ORDER BY RANDOM() LIMIT ${number} 