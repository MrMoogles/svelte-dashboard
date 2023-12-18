<script>
  import SvelteTable from "svelte-table";
  import { onMount } from "svelte";
  import "./AppStyles.css";
  let menuItems = [];
  let subMenuItems = [];
  let activeMenuItemId = null;
  let testRunContent = [];

  // For handling style of the selected environment
  let selectedEnvironment = null;

  async function fetchMenuItems(projectId = null) {
    const url =
      projectId === null
        ? "http://localhost:5000/api/projects"
        : `http://localhost:5000/api/environments/${projectId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Fetching menu items failed:", error);
      return [];
    }
  }

  function handleMenuItemClick(itemId) {
    if (activeMenuItemId === itemId) {
      activeMenuItemId = null;
    } else {
      activeMenuItemId = itemId;
    }
  }

  async function handleSubMenuItemClick(environmentId, projectId, button) {
    selectedEnvironment = button;
    const url = `http://localhost:5000/api/test-runs?environment=${environmentId}&project=${projectId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      testRunContent = await response.json();
    } catch (error) {
      console.error("Fetching test run content failed:", error);
    }
  }

  $: if (activeMenuItemId === null) {
    subMenuItems = [];
  } else {
    subMenuItems = [];
    fetchMenuItems(activeMenuItemId).then((items) => {
      subMenuItems = items;
    });
  }

  onMount(() => {
    fetchMenuItems().then((items) => {
      menuItems = items;
    });
  });

  // Define columns for SvelteTable
  let cols = [
    { key: "id", title: "ID", value: (row) => row.id },
    { key: "jobNum", title: "Job Number", value: (row) => row.job_number },
    {
      key: "environment",
      title: "Environment ID",
      value: (row) => row.environment_id,
    },
    { key: "project", title: "Project ID", value: (row) => row.project_id },
    {
      key: "runDate",
      title: "Run Date",
      value: (row) => row.run_date,
      sortable: true,
    },
    {
      key: "status",
      title: "Status",
      value: (row) => row.status,
      sortable: true,
      class: (row) => {
        if (row.status === "PASS") return "status-pass";
        if (row.status === "SKIPPED") return "status-skipped";
        if (row.status === "FAIL") return "status-fail";
        return "";
      },
    },
  ];
</script>

<div class="container">
  <!-- Sidebar Section-->
  <aside>
    <div class="toggle">
      <div class="logo">
        <img src="https://source.unsplash.com/user/c_v_r" />
        <h2>QA<span class="danger">Dashboard</span></h2>
      </div>
      <div class="close" id="close-btn">
        <span class="material-icons-sharp"> close </span>
      </div>
    </div>

    <div class="sidebar">
      {#each menuItems as item}
        <div class="main-menu">
          <button
            class="menu-button"
            on:click={() => handleMenuItemClick(item.id)}
          >
            {item.project_name}
          </button>
          {#if activeMenuItemId === item.id && subMenuItems !== undefined}
            {#if subMenuItems.length > 0}
              <div class="sub-menu">
                {#each subMenuItems as subItem}
                  <button
                    class="sub-button {selectedEnvironment === subItem
                      ? 'selected'
                      : ''}"
                    on:click={() =>
                      handleSubMenuItemClick(subItem.id, item.id, subItem)}
                    >{subItem.environment}</button
                  >
                {/each}
              </div>
            {:else}
              <div>No submenu items found.</div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </aside>
  <div class="content">
    <div class="section-1">
      {#if testRunContent && testRunContent.length > 0}
        <SvelteTable
          rows={testRunContent}
          columns={cols}
          classNameTable={["table"]}
        />
      {:else}
        <div>Select a menu item to see details here.</div>
      {/if}
    </div>
  </div>
</div>
