
const choices = Array.from({ length: 20 }, (_, i) => i + 1);

let placed = {
    a: null,
    b: null,
    c: null
};

let selectedSquare = null;

const squareContainer = document.getElementById("squareContainer");

const polygons = {
    a: document.getElementById("squareA"),
    b: document.getElementById("squareB"),
    c: document.getElementById("squareC")
};

const textElements = {
    a: {
        number: document.getElementById("numberA"),
        area: document.getElementById("areaA")
    },
    b: {
        number: document.getElementById("numberB"),
        area: document.getElementById("areaB")
    },
    c: {
        number: document.getElementById("numberC"),
        area: document.getElementById("areaC")
    }
};

// Membuat diagram segitiga dan tiga persegi yang menempel.
function drawDiagram() {
    const A = { x: 250, y: 500 };
    const B = { x: 250, y: 320 };
    const C = { x: 490, y: 500 };

    const squareA = [
        B,
        { x: 70, y: 320 },
        { x: 70, y: 500 },
        A
    ];

    const squareB = [
        A,
        { x: 250, y: 740 },
        { x: 490, y: 740 },
        C
    ];

    const squareC = [
        B,
        C,
        { x: 670, y: 260 },
        { x: 430, y: 80 }
    ];

    setPolygon("triangle", [A, B, C]);
    setPolygon("squareA", squareA);
    setPolygon("squareB", squareB);
    setPolygon("squareC", squareC);

    document.getElementById("rightAngle").setAttribute(
        "d",
        "M 250 475 L 275 475 L 275 500"
    );

    setText("labelA", 160, 420);
    setText("labelB", 370, 540);
    setText("labelC", 460, 260);

    setText("vertexA", 220, 530);
    setText("vertexB", 220, 310);
    setText("vertexC", 500, 530);

    // Posisi angka dan luas di dalam masing-masing persegi.
    setText("numberA", 160, 400);
    setText("numberB", 370, 610);
    setText("numberC", 460, 260);

    setText("areaA", 160, 430);
    setText("areaB", 370, 640);
    setText("areaC", 460, 290);
}

function setPolygon(id, points) {
    document.getElementById(id).setAttribute(
        "points",
        points.map(point => `${point.x},${point.y}`).join(" ")
    );
}

function setText(id, x, y) {
    const element = document.getElementById(id);
    element.setAttribute("x", x);
    element.setAttribute("y", y);
}

// Menampilkan pilihan persegi ukuran 1 sampai 20.
function renderChoices() {
    squareContainer.innerHTML = "";

    choices.forEach(number => {
        const card = document.createElement("div");

        card.className = "square-card";
        card.draggable = true;

        if (selectedSquare === number) {
            card.classList.add("selected");
        }

        card.innerHTML = `
            <div class="square-visual">${number}</div>
            <strong>Sisi ${number}</strong>
            <small>Luas = ${number * number}</small>
        `;

        // Memilih persegi dengan cara mengetuk.
        card.addEventListener("click", () => {
            selectedSquare = number;
            renderChoices();

            showFeedback(
                `Persegi dengan panjang sisi ${number} dipilih. Sekarang pilih area a, b, atau c.`,
                "success"
            );
        });

        // Drag and drop.
        card.addEventListener("dragstart", event => {
            selectedSquare = number;

            event.dataTransfer.setData(
                "text/plain",
                String(number)
            );

            event.dataTransfer.effectAllowed = "copy";
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });

        squareContainer.appendChild(card);
    });
}

// Memasang atau mengganti persegi pada sisi yang dipilih.
function placeSquare(number, side) {
    placed[side] = number;
    selectedSquare = null;

    renderChoices();
    updateDiagram();

    document.getElementById("feedback").style.display = "none";
    document.getElementById("explanation").style.display = "none";
}

// Memperbarui angka dan luas persegi pada diagram.
function updateDiagram() {
    ["a", "b", "c"].forEach(side => {
        const number = placed[side];
        const polygon = polygons[side];

        polygon.classList.remove("correct");

        if (number === null) {
            polygon.classList.remove("filled");

            textElements[side].number.textContent = "";
            textElements[side].area.textContent = "";
        } else {
            polygon.classList.add("filled");

            textElements[side].number.textContent = number;
            textElements[side].area.textContent =
                `Luas ${number * number}`;
        }
    });
}

// Interaksi pada ketiga area persegi.
["a", "b", "c"].forEach(side => {
    const polygon = polygons[side];

    polygon.addEventListener("dragover", event => {
        event.preventDefault();
        polygon.classList.add("drag-over");
    });

    polygon.addEventListener("dragleave", () => {
        polygon.classList.remove("drag-over");
    });

    polygon.addEventListener("drop", event => {
        event.preventDefault();
        polygon.classList.remove("drag-over");

        const number = Number(
            event.dataTransfer.getData("text/plain")
        );

        if (number > 0) {
            placeSquare(number, side);
        }
    });

    polygon.addEventListener("click", () => {
        if (selectedSquare !== null) {
            placeSquare(selectedSquare, side);
        }
    });
});

// Mengecek hubungan Teorema Pythagoras.
function checkAnswer() {
    const a = placed.a;
    const b = placed.b;
    const c = placed.c;

    if (a === null || b === null || c === null) {
        showFeedback(
            "Yuk, lengkapi ketiga persegi terlebih dahulu!",
            "error"
        );
        return;
    }

    const areaA = a * a;
    const areaB = b * b;
    const areaC = c * c;

    const result = areaA + areaB;

    if (result === areaC) {
        polygons.a.classList.add("correct");
        polygons.b.classList.add("correct");
        polygons.c.classList.add("correct");

        showFeedback(
            "Benar! Kamu berhasil menemukan hubungan Teorema Pythagoras!",
            "success"
        );

        document.getElementById("explanation").innerHTML = `
            <h3>Hubungan Pythagoras Ditemukan!</h3>
            <p>
                Luas persegi pada sisi a adalah
                <strong>${a}² = ${areaA}</strong>.
            </p>
            <p>
                Luas persegi pada sisi b adalah
                <strong>${b}² = ${areaB}</strong>.
            </p>
            <p>
                Luas persegi pada sisi c adalah
                <strong>${c}² = ${areaC}</strong>.
            </p>
            <div class="calculation">
                ${areaA} + ${areaB} = ${areaC}
            </div>
            <p>
                Dengan demikian, jumlah luas persegi pada kedua sisi
                siku-siku sama dengan luas persegi pada sisi miring.
            </p>
            <strong>a² + b² = c²</strong>
        `;

        document.getElementById("explanation").style.display = "block";

    } else {
        polygons.a.classList.remove("correct");
        polygons.b.classList.remove("correct");
        polygons.c.classList.remove("correct");

        showFeedback(
            `Belum tepat. ${areaA} + ${areaB} = ${result}, sedangkan luas persegi c adalah ${areaC}. Coba ganti ukuran perseginya!`,
            "error"
        );

        document.getElementById("explanation").style.display = "none";
    }
}

// Mengosongkan semua persegi untuk mencoba kombinasi baru.
function resetGame() {
    placed = {
        a: null,
        b: null,
        c: null
    };

    selectedSquare = null;

    renderChoices();
    updateDiagram();

    document.getElementById("feedback").style.display = "none";
    document.getElementById("explanation").style.display = "none";
}

function showFeedback(message, type) {
    const feedback = document.getElementById("feedback");

    feedback.textContent = message;
    feedback.className = "feedback " + type;
    feedback.style.display = "block";
}

// Menjalankan permainan.
drawDiagram();
renderChoices();
updateDiagram();
