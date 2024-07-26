document.addEventListener("DOMContentLoaded",()=>{
    const addForm=document.querySelector('form')
    const output_contents=document.querySelector(".output-contents")
    const navBarList=document.querySelector(".navBarList")
    const paginationContainer=document.querySelector('.pagination')
    const navButtons=document.querySelectorAll('.nav-button')
    
    let tasks=JSON.parse(localStorage.getItem('tasks'))||[]//retrieve ot fetching the data back again

    const saveTasks=()=>{//saves the tasks in local storage
        localStorage.setItem('tasks',JSON.stringify(tasks))
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
          navButtons.forEach(btn => {
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Set transparent background for inactive buttons
          });
          // Apply active styles to the clicked button
          button.style.backgroundColor = 'rgba(47, 56, 70)';
        });
    })

    var button_clicked=''
    let page_clicked=null
    const displayTask=(filter='all',page=1,tasksPerPage=5)=>{//display all the tasks with navbar
        button_clicked=filter
        page_clicked=page
        console.log('page clicked',page_clicked);
        output_contents.innerHTML=''
        let filteredTask=tasks
        if(filter==='due')
            {
            filteredTask=tasks.filter((task)=>!task.completed)//shallow copy of tasks
        }
        else if(filter==='completed')
        {
            filteredTask=tasks.filter((task)=>task.completed)//shallow copy array of tasks
        }

        const startIndex=(page-1)*tasksPerPage
        const paginatedTasks=filteredTask.slice(startIndex,startIndex+tasksPerPage)
        
        const taskListContainer=document.createElement('div')
        taskListContainer.classList.add('task-list')
        
        paginatedTasks.forEach((task)=>{
            const newDiv=createTaskElement(task)
            updateTaskElement(newDiv, task);
            taskListContainer.appendChild(newDiv)
        })
        if(taskListContainer.children.length<=0&& page_clicked>1)
        {
            displayTask(button_clicked,page_clicked-1,tasksPerPage)
            return
        }

        output_contents.appendChild(taskListContainer)
        
        updateNavBarVisibility(tasks)
        console.log('page clicked 2',page_clicked);
        console.log(page);
        updatePagination(filteredTask.length,page,tasksPerPage)
    }

    const updatePagination=(totalTask,currentPage,tasksPerPage)=>{
        //generation pagination buttons and control
        const totalPages=Math.ceil(totalTask/tasksPerPage)
        if(totalPages<=1)
        {
            paginationContainer.classList.add("hidden")
        }
        else{
            paginationContainer.classList.remove("hidden")
            paginationContainer.classList.add("visible")
            paginationContainer.innerHTML=''
        
        const prevButton=document.createElement('button')
        // const button=document.createElement('button')
        const nextButton=document.createElement('button')
        
        prevButton.classList.add("bg-white",'px-2', 'py-1','rounded-lg','mr-2')
        prevButton.textContent="Prev"
        prevButton.onclick=()=>{
            if(currentPage<=1)
                {
                    prevButton.disabled=true
                    prevButton.style.backgroundColor='rgba(132, 141, 155)'
                    prevButton.style.transitionDuration='300ms'

                }
                else{
                    displayTask(button_clicked,currentPage-1,tasksPerPage)
                }
        }

        // button.textContent=currentPage
        // button.classList.add('mr-2','px-3','py-1','bg-white')
        // button.style.borderRadius='50%'

        paginationNumDiv=document.createElement('div')
        const startPage=Math.floor((currentPage-1)/3)*3+1
        const endPage=Math.min(startPage+2,totalPages)
        for(let i=startPage;i<=endPage;i++)
        {
            const button=document.createElement('button')
            button.textContent=i
            paginationNumDiv.appendChild(button)
            button.classList.add('mr-2','px-3','py-1','bg-white','duration-300')
            button.style.borderRadius='50%'
            if(i===currentPage)
            {
                button.style.transitionDuration = '300ms'
                button.style.backgroundColor = 'rgba(47, 56, 70)'
                button.style.color = 'white'
            }
            else{
                button.addEventListener('click',()=>{
                    button.style.transitionDuration = '400ms'
                    displayTask(button_clicked,i,tasksPerPage)
                })
            }
        }
        
        nextButton.classList.add("bg-white",'px-2', 'py-1','rounded-lg')
        nextButton.textContent="next"
        nextButton.onclick=()=>{
            if(currentPage>=totalPages)
                {
                    nextButton.disabled=true
                    nextButton.style.backgroundColor='rgba(132, 141, 155)'
                    nextButton.style.transitionDuration='400ms'
                    
                }
                else{
                    displayTask(button_clicked,currentPage+1,tasksPerPage)
                }
        }
        
        
        paginationContainer.appendChild(prevButton)
        paginationContainer.appendChild(paginationNumDiv)
        paginationContainer.appendChild(nextButton)
        output_contents.appendChild(paginationContainer)
        }
    }


    
    const createTaskElement=(task)=>{
        const newDiv=document.createElement("div")//creating a input recorded div
        newDiv.className="newDiv py-1 px-2 bg-white rounded-lg mb-3 flex items-center w-max-[248px]"
        
        const checkBox=document.createElement("input")//creating a input field with checkbox in it
        checkBox.type="checkbox"
        checkBox.id="newCheckBox"
        checkBox.onclick=()=>{
            task.completed=checkBox.checked
            saveTasks()
            if(checkBox.checked==true)
            {
                label.innerHTML=`<s>${task.name}</s>`
                newDiv.className="newDiv py-1 px-2 rounded-lg mb-3 flex items-center bg-green-500 duration-300 w-max-[248px] "
            }
            else{
                label.innerHTML=task.name
                newDiv.className="newDiv py-1 px-2 bg-white rounded-lg mb-3 flex items-center duration-300 w-max-[248px]"
            }

            
        }
        
        
        const editDiv=(nav_btn,currentPage)=>{
            const editInput=document.createElement('input')
            const save_btn=document.createElement('button')
            const cancel_btn=document.createElement('button')
            save_btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 19px;" viewBox="0 0 16 16" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
</svg>`
            cancel_btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 19px;" viewBox="0 0 16 16" fill="currentColor" class="size-5">
  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
</svg>`
            cancel_btn.classList.add("px-3" ,"py-1", "ml-auto")
            
            const editDiv=document.createElement('div')
            editDiv.style.paddingTop='6px'
            editDiv.style.paddingBottom='6px'
            editDiv.classList.add("flex","spacex-x-2")
            editDiv.appendChild(editInput)
            editDiv.appendChild(save_btn)
            editDiv.appendChild(cancel_btn)
            editInput.value=label.textContent
            console.log("clicked");
            console.log(editInput.value);
            if(labelContainer && labelContainer.contains(label))
            {
                const tempDiv=document.createElement('div')
                tempDiv.replaceChildren(newDiv.children)
                newDiv.innerHTML=''
                newDiv.appendChild(editDiv)
                editInput.select()
            }

            save_btn.onclick=()=>{
                task.name=editInput.value.trim()
                saveTasks()
                displayTask(nav_btn,currentPage)
            }
            cancel_btn.onclick=()=>{
                displayTask(nav_btn,currentPage)
            }
            // labelContainer.replaceChild(label)
        }

        const deleteDiv=(nav_btn,currentPage)=>{
            tasks=tasks.filter((t)=>t.id!==task.id)
            saveTasks()
            displayTask(nav_btn,currentPage)
        }
        
        const labelContainer=document.createElement("div")
        labelContainer.classList.add("p-2")
        labelContainer.style.inlineSize="170px"
        labelContainer.style.wordBreak="break-word"
        labelContainer.style.textAlign="center"

        const label=document.createElement("label")//creating a label
        label.htmlFor="newCheckBox"
        label.textContent=task.name
        label.classList.add("p-3")

        labelContainer.appendChild(label)
        
        const editButton=document.createElement('button')
        editButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 17px;" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" /></svg>`
        editButton.onclick=()=>{editDiv(button_clicked,page_clicked)}      

  const delete_btn=document.createElement("button")//creating a delete button
        delete_btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>`
        delete_btn.className="text-black px-3 py-1 rounded ml-auto"
        delete_btn.onclick=()=>{deleteDiv(button_clicked,page_clicked)}

        newDiv.appendChild(checkBox)//appending the checkbox in the newDiv
        newDiv.appendChild(labelContainer)
        newDiv.appendChild(editButton)
        newDiv.appendChild(delete_btn)

        return newDiv
    }

    const updateTaskElement = (element, task) => {
        const label = element.querySelector('label');
        const checkBox = element.querySelector('#newCheckBox');
        if(task.completed)
        {
            checkBox.checked=task.completed
        }
        label.innerHTML = task.completed ? `<s>${task.name}</s>` : task.name;
        element.className = `py-1 px-2 rounded-lg mb-3 flex items-center duration-300 ${task.completed ? 'bg-green-500' : 'bg-white'}`;
    }

     const updateNavBarVisibility=(tasks)=>{
        if (tasks.length>0) {
            navBarList.classList.remove("hidden")
            navBarList.classList.add("flex","flex-wrap","p-2")
        }
        else{
            navBarList.classList.add("hidden")
        }
     }

    // checkBox.onclick=()=>{
    //     if(checkBox.checked==true)
    //         {
    //             label.innerHTML=`<s>${input}</s>`
    //             newDiv.className="py-1 px-2 rounded-lg mb-3 flex items-center bg-green-500 duration-300"
    //         }
    //         else{
    //             label.innerHTML=input
    //             newDiv.className="py-1 px-2 bg-white rounded-lg mb-3 flex items-center duration-300"
    //         }
    //     }
    displayTask()
    addForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        
        let input=document.querySelector('#input').value.trim()
        console.log(input)
        console.log(Date.now())
        
        const newTask={
            id: Date.now(),//unique id creation for task
            name:input,
            completed:false
        }
        tasks.push(newTask)
        saveTasks()
        displayTask()
            
            
        //     const deleteDiv=()=>{//function for deleting a div 
        //         console.log("deleted");
        //         newDiv.remove()
        //         if(output_contents.children.length==1)
        //         {
        //             navBarList.className="hidden"
        //         }
        // }
        
           addForm.reset()
    })
    document.getElementById('all-tasks').addEventListener('click',()=>{
        displayTask('all')
    })
    document.getElementById('due-tasks').addEventListener('click',()=>{
        displayTask('due')
    })
    document.getElementById('completed-tasks').addEventListener('click',()=>{
        displayTask('completed')
    })
})

