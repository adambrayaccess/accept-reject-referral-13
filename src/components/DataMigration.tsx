
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { dataMigration } from '@/services/supabase/dataMigration'

const DataMigration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<string>('')

  const handleMigrateData = async () => {
    setIsLoading(true)
    setMigrationStatus('Starting migration...')
    
    try {
      await dataMigration.migrateAll()
      setMigrationStatus('Migration completed successfully!')
      toast.success('Data migration completed!')
    } catch (error) {
      console.error('Migration failed:', error)
      setMigrationStatus(`Migration failed: ${error}`)
      toast.error('Migration failed. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMigrationStatus('Clearing data...')
    
    try {
      await dataMigration.clearAllData()
      setMigrationStatus('Data cleared successfully!')
      toast.success('Data cleared!')
    } catch (error) {
      console.error('Clear failed:', error)
      setMigrationStatus(`Clear failed: ${error}`)
      toast.error('Clear failed. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Data Migration</CardTitle>
        <CardDescription>
          Migrate mock data to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleMigrateData} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Migrating...' : 'Migrate Data'}
        </Button>
        
        <Button 
          onClick={handleClearData} 
          disabled={isLoading}
          variant="destructive"
          className="w-full"
        >
          {isLoading ? 'Clearing...' : 'Clear Data'}
        </Button>
        
        {migrationStatus && (
          <div className="text-sm text-muted-foreground">
            {migrationStatus}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DataMigration
