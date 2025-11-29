// ===============================
//  Malla Curricular Interactiva
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // Cursos con ID, nombre y prerrequisitos
    // ==================================================
    const courses = [
        // Verano 2025
        { id: "calc", name: "Cálculo Diferencial e Integral", prereqs: [] },
        { id: "algebra", name: "Álgebra Lineal", prereqs: [] },

        // Tercer Semestre
        { id: "fisicaModerna", name: "Introducción a la Física Moderna", prereqs: [] },
        { id: "varias", name: "Cálculo en Varias Variables", prereqs: ["calc", "algebra"] },
        { id: "edo", name: "Ecuaciones Diferenciales Ordinarias", prereqs: ["calc", "algebra"] },
        { id: "efi1", name: "Electivo Formación Integral", prereqs: [] },
        { id: "efi2", name: "Electivo Formación Integral", prereqs: [] },

        // Cuarto Semestre
        { id: "calcAvanzado", name: "Cálculo Avanzado y Aplicaciones", prereqs: ["varias", "edo"] },
        { id: "mecanica", name: "Mecánica", prereqs: ["calc", "algebra","fisicaModerna"] },
        { id: "metodos", name: "Métodos Experimentales", prereqs: ["fisicaModerna"] },
        { id: "quimica", name: "Química", prereqs: ["fisicaModerna"] },
        { id: "economia", name: "Economía", prereqs: ["varias"] },

        // Verano 2026
        { id: "electro", name: "Electromagnetismo", prereqs: ["varias", "edo", "mecanica"] },
        { id: "modulo", name: "Módulo Interdisciplinario", prereqs: ["metodos"] }
    ];

    // ==================================================
    // Semestres (orden)
    // ==================================================
    const semesters = [
        { name: "Verano 2025", ids: ["calc", "algebra"] },
        { name: "Tercer Semestre", ids: ["fisicaModerna", "varias", "edo", "efi1", "efi2"] },
        { name: "Cuarto Semestre", ids: ["calcAvanzado", "mecanica", "metodos", "quimica", "economia"] },
        { name: "Verano 2026", ids: ["electro", "modulo"] }
    ];

    // ==================================================
    // Estado guardado
    // ==================================================
    let estados = JSON.parse(localStorage.getItem("malla-estado")) || {};

    // Inicializa estados por defecto
    courses.forEach(c => {
        if (!estados[c.id]) {
            estados[c.id] = c.prereqs.length === 0 ? "available" : "locked";
        }
    });

    function saveState() {
        localStorage.setItem("malla-estado", JSON.stringify(estados));
    }

    // ==================================================
    // Renderizado de la malla
    // ==================================================
    function renderAll() {
        const grid = document.getElementById("semesters");
        grid.innerHTML = "";

        semesters.forEach(sem => {
            const col = document.createElement("div");
            col.className = "semester-card";

            const title = document.createElement("h2");
            title.textContent = sem.name;
            col.appendChild(title);

            sem.ids.forEach(id => {
                const c = courses.find(x => x.id === id);

                const card = document.createElement("div");
                card.className = "course";
                card.id = `course-${c.id}`;

                const left = document.createElement("div");
                left.className = "meta";
                left.innerHTML = `<strong>${c.name}</strong>
                <div class="prereq">${c.prereqs.length ? "Requisitos: " + c.prereqs.join(", ") : "Sin requisitos"}</div>`;

                const btn = document.createElement("button");
                btn.dataset.id = c.id;
                btn.addEventListener("click", onClickCourse);

                card.appendChild(left);
                card.appendChild(btn);

                col.appendChild(card);
            });

            grid.appendChild(col);
        });

        applyStyles();
    }

    // ==================================================
    // Aplicar estilos según estado
    // ==================================================
    function applyStyles() {
        courses.forEach(c => {
            const el = document.getElementById(`course-${c.id}`);
            if (!el) return;

            const btn = el.querySelector("button");
            const state = estados[c.id];

            el.classList.remove("locked", "available", "passed");
            el.classList.add(state);

            if (state === "locked") {
                btn.textContent = "Bloqueado";
                btn.disabled = true;
                btn.className = "btn ghost";
            } else if (state === "available") {
                btn.textContent = "Aprobar";
                btn.disabled = false;
                btn.className = "btn primary";
            } else {
                btn.textContent = "Aprobado ✓";
                btn.disabled = false;
                btn.className = "btn outline";
            }
        });
    }

    // ==================================================
    // Lógica al hacer click un ramo
    // ==================================================
    function onClickCourse(ev) {
        const id = ev.currentTarget.dataset.id;
        const estado = estados[id];

        if (estado === "available") {
            estados[id] = "passed";

            // desbloquear dependientes
            courses.forEach(c => {
                if (c.prereqs.includes(id)) {
                    const ok = c.prereqs.every(p => estados[p] === "passed");
                    if (ok) estados[c.id] = "available";
                }
            });

        } else if (estado === "passed") {
            estados[id] = "available";

            // bloquear dependientes recursivamente
            function lockDeps(root) {
                courses.forEach(c => {
                    if (c.prereqs.includes(root)) {
                        const ok = c.prereqs.every(p => estados[p] === "passed");
                        if (!ok) {
                            estados[c.id] = "locked";
                            lockDeps(c.id);
                        }
                    }
                });
            }
            lockDeps(id);
        }

        saveState();
        applyStyles();
    }

    // ==================================================
    // Botones: Reset / Export / Import
    // ==================================================
    document.getElementById("resetBtn").addEventListener("click", () => {
        courses.forEach(c => {
            estados[c.id] = c.prereqs.length === 0 ? "available" : "locked";
        });
        saveState();
        applyStyles();
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
        const texto = JSON.stringify(estados);
        alert("Progreso copiado a tu portapapeles:\n" + texto);
        navigator.clipboard.writeText(texto);
    });

    document.getElementById("importBtn").addEventListener("click", () => {
        const txt = prompt("Pega el JSON exportado:");
        if (!txt) return;
        try {
            estados = JSON.parse(txt);
            saveState();
            applyStyles();
        } catch {
            alert("JSON inválido.");
        }
    });

    // Render inicial
    renderAll();

});
