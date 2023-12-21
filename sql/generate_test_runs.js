function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

const statuses = ['PASS', 'FAIL', 'SKIPPED'];
const startDate = new Date('2023-12-12');
const endDate = new Date('2023-12-18');

for (let i = 100; i < 1100; i++) {
    const environmentId = randomIntFromInterval(1, 8);
    const projectId = randomIntFromInterval(1, 4);
    const runDate = formatDate(randomDate(startDate, endDate));
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    console.log(`INSERT INTO test_runs (id, job_number, environment_id, project_id, run_date, status) VALUES (UUID(), ${i}, ${environmentId}, ${projectId}, '${runDate}', '${status}');`);
}
