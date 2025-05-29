-- Funció que retorna la puntuació d'una pel·lícula pel seu id_api
CREATE OR REPLACE FUNCTION get_vote_average_by_id_api(p_id_api INTEGER)
RETURNS NUMERIC(3,1) AS $$
DECLARE
    v_vote_average NUMERIC(3,1);
BEGIN
    SELECT vote_average
    INTO v_vote_average
    FROM movies
    WHERE id_api = p_id_api;

    IF v_vote_average IS NULL THEN
        RAISE NOTICE 'No s''ha trobat cap pel·lícula amb l''id_api %', p_id_api;
    END IF;

    RETURN v_vote_average;
END;
$$ LANGUAGE plpgsql;
