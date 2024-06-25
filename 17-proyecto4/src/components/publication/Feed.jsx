import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const { auth } = useAuth();
    const [publications, setPublications] = useState({ docs: [] });
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);

    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPublications({ docs: [] });
            setPage(1);
            nextPage = 1;
        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            let newPublications = data.publications.docs;

            if (!showNews && publications.docs.length >= 1) {
                newPublications = [...publications.docs, ...data.publications.docs];
            }

            setPublications({ ...publications, docs: newPublications });

            if (!showNews && publications.docs.length >= (data.totalDocs - data.publications.docs.length)) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    }

    return (
        <section className="layout__content">
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>

            <PublicationList 
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />
            
            <br />
        </section>
    );
}
