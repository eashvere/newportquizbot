with A2 as (select bonuses.id, tournaments.name, leadin, bonuses.category_id from bonuses 
join tournaments on bonuses.tournament_id=tournaments.id and tournaments.difficulty in (2,3,4,5)) 
select leadin, array_agg(bonus_parts.text order by bonus_parts.id), 
array_agg(bonus_parts.formatted_answer order by bonus_parts.id) as ans, 
categories.categories_name, A2.name from bonus_parts join A2 on bonus_parts.bonus_id = A2.id 
join categories on A2.category_id = categories.id 
group by categories.categories_name, A2.name, bonus_id, leadin 
having (array_agg(bonus_parts.formatted_answer))[1] like '%<strong>%' 
or (position(' ' in (array_agg(bonus_parts.formatted_answer))[1]) <= 0 
and position(' ' in (array_agg(bonus_parts.formatted_answer))[2]) <= 0 
and position(' ' in (array_agg(bonus_parts.formatted_answer))[3]) <= 0) 
order by random() limit ${number} 