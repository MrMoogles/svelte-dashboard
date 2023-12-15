<script>
  import { onMount } from "svelte";
  import "./AppStyles.css";
  //TODO: Remove MenuOpen from code. The Menu is static now
  let menuOpen = false;
  let menuItems = [];
  let subMenuItems = [];
  let activeMenuItemId = null;
  let testRunContent = [];

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

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

  async function handleSubMenuItemClick(environmentId, projectId) {
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
                    class="sub-button"
                    on:click={() => handleSubMenuItemClick(subItem.id, item.id)}
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
  <div class="content" class:full={!menuOpen}>
    {#if testRunContent && testRunContent.length > 0}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Job Number</th>
            <th>Environment ID</th>
            <th>Project ID</th>
            <th>Run Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each testRunContent as testRun}
            <tr>
              <td>{testRun.id}</td>
              <td>{testRun.job_number}</td>
              <td>{testRun.environment_id}</td>
              <td>{testRun.project_id}</td>
              <td>{testRun.run_date}</td>
              <td>{testRun.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div>Select a menu item to see details here.</div>
    {/if}
  </div>
</div>
