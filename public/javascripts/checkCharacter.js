function checkCharacter(test){
    for (i=0;i<test.length;i++)
    {
        if (!   ((test[i] >= 'a' && test[i] <= 'z') || (test[i] >='A' && test[i] <='Z') || (test[i] >= 0 &&  test[i]<=9)))
            return false;
        if (test[i] == ' ')
            return false; 
    }
    return true;
};